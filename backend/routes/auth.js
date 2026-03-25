const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// GET /api/auth/setup-status — check if initial setup is needed
router.get('/setup-status', async (req, res, next) => {
    try {
        const adminCount = await User.countDocuments({ role: 'admin' });
        res.json({ needsSetup: adminCount === 0 });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/setup — create first admin (only works when no admin exists)
router.post('/setup', async (req, res, next) => {
    try {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount > 0) {
            return res.status(403).json({ message: 'Setup already completed' });
        }

        const { fullName, email, password } = req.body;

        if (!fullName || fullName.length < 2) {
            return res.status(400).json({ message: 'Full name must be at least 2 characters' });
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Valid email is required' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const admin = new User({
            fullName,
            email,
            passwordHash: password,
            role: 'admin'
        });
        await admin.save();

        res.status(201).json({ message: 'Admin account created successfully' });
    } catch (error) {
        next(error);
    }
});

const registerSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
    clientType: z.string().optional()
});

function generateTokens(userId, role) {
    const accessToken = jwt.sign(
        { userId, role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userId, role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
}

function getCookieName(clientType) {
    return clientType === 'admin' ? 'adminRefreshToken' : 'refreshToken';
}

function setCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
}

// POST /api/auth/register
router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
    try {
        const { fullName, email, phone, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const user = new User({ fullName, email, phone, passwordHash: password });
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        user.refreshToken = refreshToken;
        await User.updateOne({ _id: user._id }, { refreshToken });

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        res.status(201).json({
            message: 'Registration successful',
            user: user.toJSON(),
            accessToken
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
    try {
        const { email, password, clientType } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        user.refreshToken = refreshToken;
        await User.updateOne({ _id: user._id }, { refreshToken });

        const cookieName = getCookieName(clientType);
        res.cookie(cookieName, refreshToken, setCookieOptions());

        res.json({
            message: 'Login successful',
            user: user.toJSON(),
            accessToken
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
    try {
        const clientType = req.body.clientType;
        const cookieName = getCookieName(clientType);
        const token = req.cookies[cookieName];
        if (!token) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        await User.updateOne({ _id: user._id }, { refreshToken });

        res.cookie(cookieName, refreshToken, setCookieOptions());

        res.json({ accessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        next(error);
    }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res, next) => {
    try {
        await User.updateOne({ _id: req.user._id }, { refreshToken: null });
        res.clearCookie('refreshToken');
        res.clearCookie('adminRefreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;

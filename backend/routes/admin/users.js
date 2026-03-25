const router = require('express').Router();
const User = require('../../models/User');

// POST /api/admin/users — create a new admin user
router.post('/', async (req, res, next) => {
    try {
        const { fullName, email, password, role = 'admin' } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full name, email, and password are required' });
        }
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = await User.create({ fullName, email, passwordHash: password, role });
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/users
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-passwordHash -refreshToken')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            User.countDocuments(filter)
        ]);

        res.json({
            users,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/users/stats
router.get('/stats', async (req, res, next) => {
    try {
        const [totalUsers, newUsersThisMonth] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({
                createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
            })
        ]);
        res.json({ totalUsers, newUsersThisMonth });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/admin/users/:id/role
router.patch('/:id/role', async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Prevent self-demotion
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot change your own role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-passwordHash -refreshToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
});
// PUT /api/admin/users/:id — update user details
router.put('/:id', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        const update = {};
        if (fullName) update.fullName = fullName;
        if (email) update.email = email;
        if (password) update.passwordHash = password;

        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
            .select('-passwordHash -refreshToken');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/users/:id
router.delete('/:id', async (req, res, next) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

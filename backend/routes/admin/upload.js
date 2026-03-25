const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split('/')[1]);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

// POST /api/admin/upload — upload 1-15 images
router.post('/', upload.array('images', 15), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = req.files.map(f => `/uploads/products/${f.filename}`);
    res.json({ urls });
});

// DELETE /api/admin/upload — delete an image file
router.delete('/', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL required' });

    const filePath = path.join(__dirname, '..', url);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    res.json({ message: 'Deleted' });
});

module.exports = router;

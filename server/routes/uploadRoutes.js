import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf|doc|docx|zip|rar|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname || mimetype) { // relaxed validation for demo
    return cb(null, true);
  } else {
    cb('Error: Unallowed file type!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   POST /api/upload
// @access  Public (Should be private in production)
router.post('/', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({
      message: 'File uploaded successfully',
      fileUrl: `/uploads/${req.file.filename}`
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

export default router;

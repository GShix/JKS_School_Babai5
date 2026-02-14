const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/gallery';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: fieldname-timestamp-random.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'images') {
    // Accept images only
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid image type. Allowed: JPEG, PNG, GIF, WEBP, SVG. Got: ${file.mimetype}`), false);
    }
  } else if (file.fieldname === 'videos') {
    // Accept videos only
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid video type. Allowed: MP4, MPEG, MOV, AVI, WEBM. Got: ${file.mimetype}`), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Create multer instance
const galleryUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB max for videos
  },
  fileFilter: fileFilter
});

// Middleware for uploading multiple images and optional videos
const uploadGalleryFiles = galleryUpload.fields([
  { name: 'images', maxCount: 20 },  // Max 20 images
  { name: 'videos', maxCount: 5 }     // Max 5 videos (optional)
]);

module.exports = {
  uploadGalleryFiles,
  galleryUpload
};

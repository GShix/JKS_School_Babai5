const multer = require('multer');
const path = require('path');

// Use memory storage for Vercel serverless compatibility
// Files will be available as Buffer in req.file.buffer or req.files
const storage = multer.memoryStorage();

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

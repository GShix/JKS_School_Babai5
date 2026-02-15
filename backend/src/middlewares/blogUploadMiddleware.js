const multer = require('multer');
const path = require('path');

// Use memory storage for Vercel serverless compatibility
// Files will be available as Buffer in req.file.buffer
const storage = multer.memoryStorage();

// File filter - accept only images
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image type. Allowed: JPEG, PNG, GIF, WEBP. Got: ${file.mimetype}`), false);
  }
};

// Create multer instance for blog images
const blogImageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter
});

// Middleware for uploading single blog image (cover/featured image)
const uploadBlogImage = blogImageUpload.single('image');

// Middleware for uploading blog content images (for rich text editor)
const uploadBlogContentImage = blogImageUpload.single('contentImage');

module.exports = {
  uploadBlogImage,
  uploadBlogContentImage,
  blogImageUpload
};

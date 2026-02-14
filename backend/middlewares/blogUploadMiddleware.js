const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/blogs';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: blog-timestamp-random.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

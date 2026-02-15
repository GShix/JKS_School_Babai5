const multer = require('multer');
const path = require('path');

// Configure multer to use memory storage
// Files will be available as Buffer in req.file.buffer
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Export different upload configurations
module.exports = {
  // Single file upload
  uploadSingle: (fieldName) => upload.single(fieldName),
  
  // Multiple files upload
  uploadMultiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  
  // Multiple fields
  uploadFields: (fields) => upload.fields(fields),
  
  // Base upload instance
  upload,
};

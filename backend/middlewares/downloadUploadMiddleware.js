const multer = require('multer');
const path = require('path');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept images and PDFs
const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedPdfType = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check if it's an image
  const isImage = allowedImageTypes.test(extname.replace('.', '')) && 
                  mimetype.startsWith('image/');
  
  // Check if it's a PDF
  const isPdf = allowedPdfType.test(extname.replace('.', '')) && 
                mimetype === 'application/pdf';

  if (isImage || isPdf) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) and PDF files are allowed'));
  }
};

// Create multer upload middleware for downloads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for documents
  },
  fileFilter: fileFilter,
});

// Export different upload configurations
module.exports = {
  // Single file upload
  uploadSingle: (fieldName) => upload.single(fieldName),
  
  // Multiple files upload
  uploadMultiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  
  // Base upload instance
  upload,
};

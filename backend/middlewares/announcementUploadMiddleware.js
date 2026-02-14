const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/announcements');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const imageTypes = /jpeg|jpg|png|gif|webp|svg/;
  // Allowed document types
  const docTypes = /pdf/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  
  const isImage = imageTypes.test(ext) && mimetype.startsWith('image/');
  const isPDF = docTypes.test(ext) && mimetype === 'application/pdf';
  
  if (isImage || isPDF) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF, WEBP, SVG) and PDF files are allowed'));
  }
};

// Create multer upload middleware for announcements
const announcementUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: fileFilter,
});

// Export upload configurations
module.exports = {
  // Single file upload
  uploadSingle: announcementUpload.single('file'),
  
  // Multiple files upload (up to 5 files)
  uploadMultiple: announcementUpload.array('files', 5),
  
  // Upload instance
  upload: announcementUpload,
};

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directories if they don't exist
const noticeUploadDir = path.join(__dirname, '../uploads/career/notices');
const resumeUploadDir = path.join(__dirname, '../uploads/career/resumes');

if (!fs.existsSync(noticeUploadDir)) {
  fs.mkdirSync(noticeUploadDir, { recursive: true });
}
if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}

// Configure storage for job position notices (PDF/images)
const noticeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, noticeUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// Configure storage for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter for notices (images and PDFs)
const noticeFileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp|svg/;
  const docTypes = /pdf/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  
  const isImage = imageTypes.test(ext) && mimetype.startsWith('image/');
  const isPDF = docTypes.test(ext) && mimetype === 'application/pdf';
  
  if (isImage || isPDF) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF, WEBP, SVG) and PDF files are allowed for notices'));
  }
};

// File filter for resumes (PDF, DOC, DOCX)
const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  
  const isPDF = ext === '.pdf' && mimetype === 'application/pdf';
  const isDoc = (ext === '.doc' || ext === '.docx') && 
                (mimetype === 'application/msword' || 
                 mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  
  if (isPDF || isDoc) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF and DOC/DOCX files are allowed for resumes'));
  }
};

// Create multer upload middleware for job position notices
const noticeUpload = multer({
  storage: noticeStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: noticeFileFilter
});

// Create multer upload middleware for resumes
const resumeUpload = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size for resumes
  },
  fileFilter: resumeFileFilter
});

module.exports = {
  noticeUpload,
  resumeUpload
};

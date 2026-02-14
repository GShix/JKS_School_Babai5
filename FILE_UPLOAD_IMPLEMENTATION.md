# File Upload Implementation for Announcements

## Overview
Complete file upload system allowing administrators to attach images and PDFs to announcements. Files are stored on the server and displayed to users in the announcements modal.

## Backend Implementation

### 1. Database Model Updates
**File:** `backend/database/models/announcementModel.js`

**Changes:**
- Added `isPinned` boolean field for pinning announcements
- Replaced `publishDate/expiryDate` with `startDate/endDate` for better clarity
- Updated `attachments` field with getter/setter to automatically handle JSON serialization
- Updated priority values: `'low' | 'medium' | 'high' | 'urgent'` (changed from 'normal' to 'medium')

**Attachments Structure:**
```javascript
{
  filename: string,      // Server-generated unique filename
  originalName: string,  // Original uploaded filename
  fileType: string,      // MIME type (e.g., 'image/jpeg', 'application/pdf')
  url: string,          // Relative URL path
  size: number          // File size in bytes
}
```

### 2. File Upload Middleware
**File:** `backend/middlewares/announcementUploadMiddleware.js`

**Features:**
- **Storage:** Disk storage in `uploads/announcements/` directory
- **File Types:** Images (JPEG, JPG, PNG, GIF, WEBP, SVG) and PDF
- **File Size Limit:** 10MB per file
- **Max Files:** 5 files per upload
- **Filename Format:** `{timestamp}-{random}-{originalname}`

**Usage:**
```javascript
const { uploadMultiple } = require('../middlewares/announcementUploadMiddleware');
router.post('/announcements/create', uploadMultiple, createAnnouncement);
```

### 3. Controller Updates
**File:** `backend/controllers/announcementController.js`

**New Functions:**
- `processUploadedFiles(files)` - Converts multer file objects to attachment objects
- `deleteFiles(attachments)` - Removes physical files from disk

**Updated Endpoints:**

#### Create Announcement
- Validates required fields before processing files
- Cleans up uploaded files if validation fails
- Saves file metadata in attachments field

#### Update Announcement
- Supports adding new files
- Handles removal of existing files via `removeAttachments` parameter
- Merges existing and new attachments

#### Delete Announcement
- Automatically deletes all associated files from disk
- Prevents orphaned files

#### Toggle Pin (NEW)
- PATCH `/api/announcements/:id/pin`
- Updates isPinned status

### 4. Routes Updates
**File:** `backend/routes/announcementRoute.js`

**Routes:**
```javascript
// Public
GET    /api/announcements          - Get all announcements
GET    /api/announcements/:id      - Get single announcement

// Admin (requires protectAdmin, requireAdmin)
POST   /api/announcements/create   - Create announcement (with uploadMultiple)
PUT    /api/announcements/:id      - Update announcement (with uploadMultiple)
PATCH  /api/announcements/:id/pin  - Toggle pin status
DELETE /api/announcements/:id      - Delete announcement
```

### 5. Static File Serving
**File:** `backend/app.js`

Added:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

This allows uploaded files to be accessed via:
```
http://localhost:3000/uploads/announcements/{filename}
```

## Frontend Implementation

### 1. Type Definitions
**File:** `frontend/src/api/types.ts`

Updated `Announcement` interface:
```typescript
export interface Announcement {
  id: number;
  title: string;
  content: string;
  targetAudience?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  isPinned?: boolean;
  startDate?: string;
  endDate?: string;
  attachments?: Array<{
    filename: string;
    originalName: string;
    fileType: string;
    url: string;
    size: number;
  }>;
  status: 'active' | 'expired' | 'draft';
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### 2. Admin Management Component
**File:** `frontend/src/components/admin/AnnouncementsManagement.tsx`

**New State:**
```typescript
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
const [filesToRemove, setFilesToRemove] = useState<string[]>([]);
```

**New Functions:**
- `handleFileSelect()` - Validates file type, size, and count before adding
- `removeSelectedFile()` - Removes file from upload queue
- `removeExistingFile()` - Marks existing file for deletion
- `restoreExistingFile()` - Restores file marked for deletion
- `formatFileSize()` - Converts bytes to readable format (B, KB, MB)

**Form Submission:**
- Changed from JSON to FormData
- Sends files with key `'files'`
- Sends removeAttachments as JSON string for updates

**UI Features:**
- Drag-and-drop file upload area
- Live preview of selected files with icons (image/PDF)
- File size display
- Remove/restore existing files when editing
- Validation messages for invalid files
- File count column in data table

### 3. Public Announcements Modal
**File:** `frontend/src/components/AnnouncementsModal.tsx`

**Features:**
- Displays attached files in blue-highlighted section
- Shows file count badge
- Different icons for images vs PDFs
- File size display
- Download button on hover
- Opens files in new tab when clicked

**Attachment Display:**
```tsx
{announcement.attachments && announcement.attachments.length > 0 && (
  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <FileText className="w-4 h-4 text-blue-600" />
      <span>Attachments ({announcement.attachments.length})</span>
    </div>
    {/* File links with icons and sizes */}
  </div>
)}
```

## File Validation

### Backend Validation
```javascript
// File type filter in middleware
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 
    'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// File size limit
limits: { fileSize: 10 * 1024 * 1024 } // 10MB
```

### Frontend Validation
```typescript
// File type validation
const validTypes = [
  'image/jpeg', 'image/jpg', 'image/png', 
  'image/gif', 'image/webp', 'image/svg+xml', 
  'application/pdf'
];

// Size validation
const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);

// Count validation
const totalFiles = selectedFiles.length + existingAttachments.length 
                  - filesToRemove.length + files.length;
if (totalFiles > 5) {
  alert('Maximum 5 files allowed');
}
```

## Error Handling

### Backend
- **Validation Failure:** Cleans up uploaded files before returning error
- **Update Not Found:** Cleans up new uploads if announcement doesn't exist
- **General Error:** Removes all uploaded files in catch block

### Frontend
- **Network Errors:** Clear error messages with retry button
- **Validation Errors:** Alert messages for invalid files
- **Size Errors:** List of oversized files
- **Count Errors:** Maximum file limit message

## Usage Example

### Creating Announcement with Files
```typescript
// Admin selects files via file input
<input 
  type="file" 
  multiple 
  accept="image/*,application/pdf"
  onChange={handleFileSelect}
/>

// FormData is built and sent
const formData = new FormData();
formData.append('title', 'Important Notice');
formData.append('content', 'Please read the attached documents');
formData.append('priority', 'high');
selectedFiles.forEach(file => formData.append('files', file));

axios.post('/api/announcements/create', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### Updating with File Management
```typescript
// Remove specific files
formData.append('removeAttachments', JSON.stringify([
  'filename1.jpg',
  'filename2.pdf'
]));

// Add new files
newFiles.forEach(file => formData.append('files', file));
```

### Displaying Files
```tsx
<a href={`http://localhost:3000${file.url}`} target="_blank">
  {file.fileType.startsWith('image/') ? (
    <ImageIcon className="w-4 h-4 text-blue-500" />
  ) : (
    <FileText className="w-4 h-4 text-red-500" />
  )}
  {file.originalName} ({formatFileSize(file.size)})
</a>
```

## Directory Structure
```
backend/
├── uploads/
│   └── announcements/
│       ├── 1234567890-abc123-document.pdf
│       ├── 1234567891-def456-image.jpg
│       └── ...
├── middlewares/
│   └── announcementUploadMiddleware.js
└── controllers/
    └── announcementController.js
```

## Security Considerations

1. **File Type Validation:** Both frontend and backend validate MIME types
2. **File Size Limits:** 10MB enforced on both sides
3. **Unique Filenames:** Timestamp + random string prevents collisions
4. **Path Traversal Prevention:** Files saved with controlled naming
5. **Cleanup on Error:** Orphaned files are removed
6. **Authorization:** Only authenticated admins can upload

## Testing Checklist

- [ ] Upload single image
- [ ] Upload single PDF
- [ ] Upload multiple files (up to 5)
- [ ] Attempt to upload 6+ files (should fail)
- [ ] Attempt to upload file > 10MB (should fail)
- [ ] Attempt to upload invalid file type (should fail)
- [ ] Edit announcement and add new files
- [ ] Edit announcement and remove existing files
- [ ] Delete announcement (verify files are deleted)
- [ ] View announcement modal with attachments
- [ ] Download files from announcement modal
- [ ] Error handling when backend is offline

## Future Enhancements

1. **Image Preview:** Thumbnail preview in admin panel
2. **Direct Upload to Cloud:** AWS S3, Cloudinary integration
3. **File Organization:** Categorize by year/month
4. **Compression:** Automatic image optimization
5. **Virus Scanning:** Malware detection on upload
6. **Progress Indicator:** Upload progress bar
7. **Batch Operations:** Upload multiple announcements with files
8. **File History:** Track file modifications

# Staff Image Upload Implementation Guide

## Overview
This project uses **Supabase Storage** for storing staff profile images with **Multer** for handling file uploads. This is a professional, scalable solution that provides:

- ✅ Cloud-based storage (no local file management issues)
- ✅ CDN-backed delivery (fast image loading)
- ✅ Automatic backup and redundancy
- ✅ Easy permission management
- ✅ Cost-effective at scale

## Architecture

```
Frontend (React) → Multer Middleware → Supabase Storage
     ↓                    ↓                    ↓
  FormData          Memory Buffer         Cloud Storage
                                               ↓
                                          Public URL
```

### Why This Stack?

1. **Multer (Memory Storage)**: Processes uploads without touching disk
2. **Supabase Storage**: Stores files in cloud with public URLs
3. **No /uploads folder**: Avoids deployment/Git issues with local files

## Setup Instructions

### 1. Create Supabase Storage Bucket

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** → **Create Bucket**
4. Bucket name: `staff-images`
5. Set as **Public** bucket
6. Save bucket

### 2. Configure Environment Variables

Add to `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
```

Find these in: Supabase Dashboard → Settings → API

### 3. Install Dependencies

Already installed:
```bash
npm install multer @supabase/supabase-js
```

## File Structure

```
backend/
├── config/
│   └── supabase.js              # Supabase client & upload utilities
├── middlewares/
│   └── uploadMiddleware.js      # Multer configuration
├── controllers/
│   └── staffController.js       # Updated with image handling
└── routes/
    └── staffRoute.js            # Routes with file upload middleware
```

## How It Works

### Backend Flow

1. **Request arrives** with multipart/form-data
2. **Multer** parses file into memory (req.file.buffer)
3. **Controller** uploads buffer to Supabase
4. **Supabase** returns public URL
5. **Database** stores URL in profileImage field

### Frontend Flow

1. User selects image file
2. FormData object created with file + fields
3. Axios sends with `Content-Type: multipart/form-data`
4. Image preview shown using FileReader
5. On submit, file uploaded to backend

## API Endpoints

### Create Staff (with image)
```http
POST /api/staff/create
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- fullName: string
- email: string
- position: string
- department: string
- profileImage: file (optional)
- ... other fields
```

### Update Staff (with image)
```http
PUT /api/staff/:id/update
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body: (same as create)
Note: If new image uploaded, old image automatically deleted
```

### Delete Staff
```http
DELETE /api/staff/:id/delete
Note: Automatically deletes associated image from Supabase
```

## Frontend Usage Example

```tsx
const formData = new FormData();
formData.append('fullName', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('profileImage', fileObject); // File from input

await axios.post('/api/staff/create', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

## Security Features

1. **File Type Validation**: Only images allowed (jpeg, jpg, png, gif, webp)
2. **File Size Limit**: Max 5MB per file
3. **Authentication**: Only admins can upload
4. **Unique Filenames**: Timestamp-based naming prevents conflicts
5. **Memory Storage**: No temp files left on server

## Storage Management

### Manual Image Deletion
If you need to clean up orphaned images:

```javascript
// In Supabase Dashboard → Storage → staff-images
// Or programmatically:
const { deleteFromSupabase } = require('./config/supabase');
await deleteFromSupabase('filename.jpg', 'staff-images');
```

### Storage Policies
Set in Supabase Storage:
- **Public Read**: Anyone can view images
- **Admin Write**: Only authenticated admins can upload/delete

## Displaying Staff Images

### In Staff Management Component
```tsx
{staff.profileImage && (
  <img 
    src={staff.profileImage} 
    alt={staff.fullName}
    className="w-12 h-12 rounded-full object-cover"
  />
)}
```

### In About/Staff Page
```tsx
{staff.map(member => (
  <div key={member.id}>
    <img 
      src={member.profileImage || '/img/default-avatar.png'} 
      alt={member.fullName}
    />
    <h3>{member.fullName}</h3>
    <p>{member.position}</p>
  </div>
))}
```

## Troubleshooting

### Images Not Uploading
1. Check Supabase credentials in `.env`
2. Verify bucket exists and is public
3. Check browser console for errors
4. Verify file size < 5MB

### Images Not Displaying
1. Check if `profileImage` URL is saved in database
2. Verify Supabase bucket is public
3. Check CORS settings in Supabase
4. Inspect network tab for 404s

### Old Images Not Deleting
- Check Supabase Storage policies
- Verify filename extraction logic
- Check backend logs for errors

## Best Practices

1. **Always validate file types** on both frontend and backend
2. **Set reasonable size limits** (5MB is good for profile images)
3. **Use image optimization** (compress before upload on frontend)
4. **Implement loading states** during upload
5. **Show upload progress** for better UX
6. **Handle errors gracefully** with user-friendly messages

## Alternative Storage Options

If you don't want to use Supabase, you can easily swap to:

- **AWS S3**: Change `uploadToSupabase` to use AWS SDK
- **Cloudinary**: Similar API, great for image transformations
- **Azure Blob Storage**: Microsoft cloud storage
- **Local Storage** (not recommended): Save to `/uploads` folder

All you need to change is the `config/supabase.js` file!

## Migration from Local Storage

If you had images in `/uploads` folder:

```javascript
// Migration script
const fs = require('fs');
const path = require('path');

async function migrateImages() {
  const uploadsDir = path.join(__dirname, 'uploads');
  const files = fs.readdirSync(uploadsDir);
  
  for (const file of files) {
    const buffer = fs.readFileSync(path.join(uploadsDir, file));
    await uploadToSupabase(buffer, file);
  }
}
```

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs/guides/storage
2. Review Multer docs: https://github.com/expressjs/multer
3. Check backend logs for detailed error messages

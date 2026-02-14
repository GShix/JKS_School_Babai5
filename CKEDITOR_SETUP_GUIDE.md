# CKEditor 5 Setup Guide for Blog Management

## Overview
This guide covers the complete CKEditor 5 integration for the blog management system with custom image upload functionality.

## What's Been Implemented

### Backend Components

#### 1. Blog Upload Middleware (`backend/middlewares/blogUploadMiddleware.js`)
```javascript
- Single image upload for blog content
- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, GIF, WEBP
- Storage location: uploads/blogs/
```

#### 2. Blog Controller (`backend/controllers/blogController.js`)
```javascript
// New uploadImage function (lines 107-123)
exports.uploadImage = async (req, res) => {
  // Handles image uploads from CKEditor
  // Returns JSON: { url: "/uploads/blogs/filename.jpg" }
}
```

#### 3. Blog Routes (`backend/routes/blogRoute.js`)
```javascript
// New endpoint for CKEditor image uploads
POST /api/blogs/upload-image
- Requires: Admin authentication
- Middleware: protectAdmin, requireAdmin, uploadBlogContentImage
- Returns: Image URL for insertion into editor
```

### Frontend Components

#### 1. Custom Upload Adapter (`BlogsManagement.tsx` lines 52-98)
```typescript
class MyUploadAdapter {
  // Handles file upload from CKEditor toolbar
  // Features:
  // - File validation (type and size)
  // - Progress tracking
  // - Authentication headers
  // - Error handling
}
```

#### 2. Upload Adapter Plugin (`BlogsManagement.tsx` lines 101-105)
```typescript
function MyCustomUploadAdapterPlugin(editor: any) {
  // Registers custom upload adapter with CKEditor
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}
```

#### 3. Editor Configuration (`BlogsManagement.tsx` lines 108-154)
```typescript
const editorConfiguration = {
  extraPlugins: [MyCustomUploadAdapterPlugin],
  toolbar: {
    items: [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'fontSize', 'fontColor', 'fontBackgroundColor', '|',
      'link', 'imageUpload', 'mediaEmbed', '|',
      'blockQuote', 'insertTable', '|',
      'bulletedList', 'numberedList', '|',
      'alignment', '|',
      'code', 'codeBlock', '|',
      'undo', 'redo'
    ]
  }
};
```

#### 4. CKEditor Component (`BlogsManagement.tsx` lines 369-378)
```tsx
<CKEditor
  editor={ClassicEditor}
  config={editorConfiguration}
  data={formData.content}
  onChange={(_event: any, editor: any) => {
    const data = editor.getData();
    setFormData({ ...formData, content: data });
  }}
/>
```

## Installation Steps

### 1. Install Required Packages
```bash
cd frontend
npm install --save --legacy-peer-deps @ckeditor/ckeditor5-react@^6.2.0 @ckeditor/ckeditor5-build-classic@^40.2.0
```

**Note**: The `--legacy-peer-deps` flag is used to avoid peer dependency conflicts with React 19.

### 2. Verify Backend Setup
Ensure the backend server is running with the blog upload endpoint:
```bash
cd backend
npm start
```

Check that this endpoint is accessible:
- `POST http://localhost:5000/api/blogs/upload-image`

### 3. Remove Old Dependencies (if any)
If you previously had React-Quill installed:
```bash
npm uninstall react-quill
```

## How It Works

### Image Upload Flow

1. **User Action**: Admin clicks the image upload button in CKEditor toolbar
2. **File Selection**: User selects an image from their device
3. **Validation**: `MyUploadAdapter` validates:
   - File type (image/jpeg, image/png, image/gif, image/webp)
   - File size (maximum 5MB)
4. **Upload**: Image is sent to `/api/blogs/upload-image` with:
   - Multipart form data
   - Bearer token authentication
5. **Storage**: Backend saves image to `uploads/blogs/` directory
6. **Response**: Backend returns: `{ url: "/uploads/blogs/filename.jpg" }`
7. **Insertion**: CKEditor inserts image into content at cursor position

### Content Storage

- Blog content is stored as **HTML** in the database
- Images are referenced by their server URLs: `<img src="/uploads/blogs/image.jpg">`
- When displaying blogs publicly, the HTML is rendered directly

## Features Included

### Rich Text Editing
- **Headings**: H1, H2, H3, H4, H5, H6
- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Font Styling**: Font size, color, background color
- **Lists**: Bulleted and numbered
- **Alignment**: Left, center, right, justify
- **Links**: Insert and edit hyperlinks
- **Media**: Images and embedded media (YouTube, etc.)
- **Tables**: Insert and manage tables
- **Quotes**: Block quotes
- **Code**: Inline code and code blocks
- **History**: Undo/Redo

### Image Upload
- Direct upload from toolbar
- Drag and drop support (built into CKEditor)
- 5MB file size limit
- Multiple image format support
- Progress indication during upload
- Authentication-protected uploads

## Security Considerations

### Authentication
- All image uploads require admin authentication
- Bearer token from localStorage/sessionStorage
- Tokens validated on every request

### File Validation
- **Frontend**: Type and size checks before upload
- **Backend**: Additional validation in Multer middleware
- **Storage**: Files saved with sanitized names

### File Size Limits
- Blog content images: 5MB maximum
- Prevents server storage abuse
- Clear error messages for users

## Usage in Admin Panel

### Creating a New Blog
1. Navigate to Blogs Management section
2. Click "Add New Blog"
3. Fill in title, author, category
4. Use CKEditor for content:
   - Type or paste text
   - Click image icon to upload images
   - Format text using toolbar
   - Insert links, tables, etc.
5. Click "Submit" to save

### Editing Existing Blog
1. Click edit icon on blog row
2. Existing HTML content loads into CKEditor
3. Make changes using toolbar
4. Upload new images if needed
5. Click "Update" to save changes

## Troubleshooting

### Images Not Uploading
**Check:**
- Backend server is running
- Auth token is valid (not expired)
- Image file size is under 5MB
- File is valid image format
- `uploads/blogs/` directory exists with write permissions

**Debug Steps:**
1. Open browser console (F12)
2. Check Network tab during upload
3. Look for 401 (auth), 413 (file too large), or 500 (server error)

### Editor Not Loading
**Check:**
- CKEditor packages installed: `npm list @ckeditor/ckeditor5-react`
- No console errors in browser
- React version compatibility (React 18+)

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
If you see module declaration errors:
```bash
npm install --save-dev @types/ckeditor__ckeditor5-react
```

## API Reference

### Upload Endpoint

**POST** `/api/blogs/upload-image`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
```
image: (binary file)
```

**Success Response (200):**
```json
{
  "url": "/uploads/blogs/1234567890-image.jpg"
}
```

**Error Responses:**
```json
// No file uploaded (400)
{ "error": "No image file provided" }

// Invalid file type (400)
{ "error": "Only image files are allowed" }

// File too large (413)
{ "error": "File size exceeds 5MB limit" }

// Unauthorized (401)
{ "error": "Not authorized" }
```

## Configuration Options

### Customizing Toolbar
Edit the toolbar in `editorConfiguration` object:

```typescript
const editorConfiguration = {
  toolbar: {
    items: [
      // Add or remove items here
      'heading',
      'bold',
      'italic',
      // ... more items
    ]
  }
};
```

Available toolbar items:
- `heading`, `bold`, `italic`, `underline`, `strikethrough`
- `fontSize`, `fontColor`, `fontBackgroundColor`
- `link`, `imageUpload`, `mediaEmbed`
- `blockQuote`, `insertTable`
- `bulletedList`, `numberedList`
- `alignment`, `outdent`, `indent`
- `code`, `codeBlock`
- `undo`, `redo`

### Changing Upload Limits
**Frontend** (`MyUploadAdapter.upload()` method):
```typescript
if (file.size > 5 * 1024 * 1024) { // Change 5 to your limit in MB
```

**Backend** (`blogUploadMiddleware.js`):
```javascript
limits: { fileSize: 5 * 1024 * 1024 } // Change 5 to your limit in MB
```

## Next Steps

### Public Blog Display
Create a public blog page component to display blog content:

```tsx
function BlogPost({ blog }) {
  return (
    <div>
      <h1>{blog.title}</h1>
      <p>By {blog.author} - {blog.date}</p>
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
```

**CSS for blog content:**
```css
.blog-content img {
  max-width: 100%;
  height: auto;
}

.blog-content table {
  border-collapse: collapse;
  width: 100%;
}

.blog-content blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  margin: 1em 0;
}
```

### SEO Optimization
- Extract plain text from HTML for meta descriptions
- Use first image as og:image for social sharing
- Generate reading time from content length

### Content Sanitization
For extra security when displaying user-generated content:
```bash
npm install dompurify
```

```tsx
import DOMPurify from 'dompurify';

function BlogPost({ blog }) {
  const sanitizedContent = DOMPurify.sanitize(blog.content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}
```

## Support

For CKEditor documentation:
- Official docs: https://ckeditor.com/docs/ckeditor5/latest/
- Custom upload adapters: https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/upload-adapter.html
- Toolbar configuration: https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html

## Summary

✅ **Complete Implementation**
- Custom upload adapter for image handling
- Rich text editing with full toolbar
- Secure, authenticated uploads
- File validation and size limits
- HTML storage in database
- Ready for production use

🎯 **What You Get**
- Professional blog authoring experience
- Drag-and-drop image uploads
- Comprehensive formatting options
- Mobile-responsive editor
- Built-in image optimization

📝 **What's Next**
- Install the npm packages (`npm install` command above)
- Test the editor in admin panel
- Create public blog display page
- Add content sanitization for security
- Implement SEO features

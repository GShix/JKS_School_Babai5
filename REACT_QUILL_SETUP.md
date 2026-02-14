# React-Quill Installation Guide for Blog Editor

## Installation Steps

### 1. Install React-Quill Package

Run the following command in the `frontend` directory:

```bash
npm install react-quill
```

Or if using yarn:
```bash
yarn add react-quill
```

### 2. Install TypeScript Type Definitions

```bash
npm install --save-dev @types/react-quill
```

Or with yarn:
```bash
yarn add -D @types/react-quill
```

## What's Included

The blog editor now features:

### ✨ Rich Text Editing Features
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headers**: H1-H6 heading styles
- **Font**: Multiple font options
- **Text Size**: Small, normal, large, huge
- **Colors**: Text color and background color
- **Lists**: Ordered and unordered lists
- **Alignment**: Left, center, right, justify
- **Indentation**: Increase/decrease indent
- **Special Formats**: Blockquote, code block
- **Subscript/Superscript**: For mathematical notations
- **Media**: Links, images, videos

### 📸 Image Upload Integration
- Click the image icon in the toolbar
- Select image from your computer
- Automatic upload to server (`/uploads/blogs/`)
- Image inserted directly into content
- 5MB file size limit
- Supports: JPEG, PNG, GIF, WEBP

### Backend Support
Already configured:
- ✅ Image upload middleware (`blogUploadMiddleware.js`)
- ✅ Upload endpoint (`POST /api/blogs/upload-image`)
- ✅ Image storage in `uploads/blogs/` directory
- ✅ Authentication required for uploads

## Usage

1. **Create New Blog Post**:
   - Click "New Blog Post" button
   - Type content in the rich text editor
   - Click image icon to upload images
   - Images appear inline in content

2. **Edit Existing Blog**:
   - Click edit icon on any blog
   - Content loads in rich text editor
   - Make changes with formatting tools
   - Save to update

3. **Image Upload**:
   - Click image icon in toolbar
   - Select image file (max 5MB)
   - Image uploads and inserts automatically
   - Images stored permanently on server

## Content Storage

- Blog content is stored as HTML in the database
- Images are referenced by their server URL
- Content displays with all formatting intact

## Styling

The editor uses Quill's Snow theme with custom styling:
- Clean, modern interface
- Minimum height: 400px
- Full toolbar with all formatting options
- Responsive design

## Terminal Commands

From the project root:
```bash
cd frontend
npm install react-quill @types/react-quill
```

Then restart your development server:
```bash
npm run start
```

## Verification

After installation, check for:
1. No TypeScript errors in BlogsManagement.tsx
2. Rich text editor appears in blog modal
3. Toolbar shows all formatting options
4. Image icon clickable and uploads work
5. Content saves with HTML formatting

## Troubleshooting

**If editor doesn't appear:**
- Check console for errors
- Verify react-quill is installed: `npm list react-quill`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**If image upload fails:**
- Verify backend server is running
- Check authentication token is valid
- Ensure uploads/blogs directory exists
- Check file size is under 5MB

**If styles look wrong:**
- Ensure `import 'react-quill/dist/quill.snow.css';` is present
- Check for CSS conflicts in global styles
- Try clearing browser cache

## Package Versions

Recommended versions:
- `react-quill`: ^2.0.0 or latest
- `@types/react-quill`: ^2.0.0 or latest

Compatible with:
- React 19.1.0
- TypeScript 5.8.3

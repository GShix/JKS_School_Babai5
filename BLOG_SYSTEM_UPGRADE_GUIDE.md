# Blog System Upgrade Guide

## Overview
The blog system has been completely upgraded with new features and security enhancements.

## What's New

### 1. **Admin-Only Blog Creation**
- Blogs can now **only be created from the Admin Dashboard**
- Public blog creation has been removed for security
- Author is automatically set to the logged-in admin

### 2. **Enhanced Blog Categories**
Fixed categories tailored for schools:
- **Admissions** - Admission-related posts
- **Results** - Exam results and announcements
- **Academic** - Study materials, syllabi, curriculum
- **Events** - School events and activities
- **Sports** - Sports achievements and events
- **Achievements** - Student/school achievements
- **Announcements** - Official announcements
- **General** - General posts

### 3. **Audience Control**
Control who can view each blog post:
- **Public** - Visible to everyone (including visitors)
- **Students & Parents** - Only logged-in students/parents
- **Teachers Only** - Restricted to teachers
- **Internal** - Admin and staff only

### 4. **Cover Image Upload**
- Upload cover images directly (no more URL-only)
- Image validation (max 5MB, image types only)
- Live preview before publishing
- Stored securely in Supabase Storage

### 5. **Draft & Publish Workflow**
Two publishing options:
- **Save as Draft** - Save progress without publishing
- **Publish** - Make the blog live immediately

Three action buttons:
- Cancel
- Save as Draft
- Publish

### 6. **Auto-Tracking**
- **Author tracking** - Automatically captures admin name and ID
- **View counter** - Tracks blog post views
- **Published date** - Auto-set when published
- **Tags support** - Add comma-separated tags

### 7. **Status Management**
Blog statuses:
- `draft` - Work in progress
- `published` - Live and visible to audience
- `archived` - Hidden but not deleted

## Database Changes

### New Fields Added:
```javascript
authorId          // ID of admin who created the blog
audience          // public, students_parents, teachers, internal
publishedDate     // Date when published
views             // View counter
tags              // Comma-separated tags
```

### Updated Fields:
```javascript
blogStatus        // Now ENUM: draft, published, archived
blogCategory      // Now ENUM with school categories
blogImage         // For uploaded cover image
```

## Migration Steps

### Step 1: Run Database Migration
```bash
cd backend
node scripts/migrateBlogEnhancements.js
```

This will:
- Add new columns (authorId, audience, publishedDate, views, tags)
- Update blogStatus and blogCategory to ENUM types
- Set publishedDate for existing published blogs
- Initialize views counter

### Step 2: Restart Backend Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

### Step 3: Clear Browser Cache
- Clear browser cache or hard refresh (Ctrl+Shift+R)
- Log out and log back in to admin dashboard

## API Endpoints (Updated)

### Create Blog (Admin Only)
```
POST /api/blogs
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- blogTitle (required)
- blogDescription (required)
- blogCategory (required)
- blogStatus (draft/published)
- audience (public/students_parents/teachers/internal)
- image (file upload - cover image)
- tags (optional)
```

### Update Blog (Admin Only)
```
PUT /api/blogs/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields: Same as create
```

### Fetch Blogs (Public)
```
GET /api/blogs
Optional Query Params:
- audience (filter by audience)
- status (filter by status)
```

### Fetch Single Blog (Public)
```
GET /api/blogs/:id
```

### Delete Blog (Admin Only)
```
DELETE /api/blogs/:id
Optional Query Param:
- permanent=true (hard delete, otherwise archives)
```

### Upload Content Image (For Rich Text Editor)
```
POST /api/blogs/upload-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Field: contentImage (file)
```

## Frontend Usage

### Creating a New Blog Post

1. Go to **Admin Dashboard** → **Blogs Management**
2. Click **"New Blog Post"**
3. Fill in the form:
   - Title (required)
   - Cover Image (upload, required)
   - Content (rich text with image support)
   - Category (select from dropdown)
   - Audience (who can view)
   - Tags (optional)
4. Choose action:
   - **Cancel** - Discard changes
   - **Save as Draft** - Save without publishing
   - **Publish** - Make it live

### Editing a Blog Post

1. Click the **Edit** button on any blog
2. Make your changes
3. Click:
   - **Save as Draft** - Keep as draft
   - **Update & Publish** - Publish the changes

### Deleting a Blog

1. Click the **Delete** button
2. Confirm deletion
3. Blog will be **archived** (soft delete)
4. To permanently delete, add `?permanent=true` query param

## Important Notes

### ⚠️ Breaking Changes
- Old blog creation endpoints removed from public routes
- URL-based cover images replaced with file uploads
- Free-text categories replaced with fixed categories

### 🔒 Security Improvements
- Only authenticated admins can create/edit blogs
- Author automatically set from logged-in admin
- Cannot impersonate other authors

### 📝 Best Practices
1. Always add a **cover image** for better engagement
2. Choose the right **category** for better organization
3. Use **audience** to restrict sensitive content
4. Use **tags** for better searchability
5. Save as **draft** to review before publishing

## Troubleshooting

### Issue: 404 Error on Update/Create
**Solution:** Routes have been fixed. Update uses `/api/blogs/:id` now.

### Issue: Cover Image Not Uploading
**Solution:** 
- Ensure image is less than 5MB
- Check file type (PNG, JPG, GIF, WEBP only)
- Verify Supabase storage is configured

### Issue: Category Dropdown Empty
**Solution:** Clear browser cache and refresh

### Issue: Author Field Empty
**Solution:** Ensure you're logged in and admin data is in localStorage/sessionStorage

## Testing Checklist

- [ ] Create a new blog post
- [ ] Upload cover image
- [ ] Save as draft
- [ ] Publish a draft
- [ ] Edit existing blog
- [ ] Update cover image
- [ ] Change audience
- [ ] Delete a blog
- [ ] View blog on frontend
- [ ] Check view counter increments
- [ ] Verify audience restrictions work

## Support

For issues or questions, check:
1. Browser console for errors
2. Backend logs for API errors
3. Database connection status
4. Supabase storage configuration

---

**Last Updated:** February 22, 2026
**Version:** 2.0.0

# Testing Staff Profile Image Upload

## 🧪 Quick Test Guide

### Prerequisites
- [ ] Backend running on `http://localhost:4000`
- [ ] Frontend running on dev server
- [ ] Supabase bucket `staff-images` created and public
- [ ] `.env` file configured with Supabase credentials

### Test 1: Create Staff with Image ✅

1. **Login as Admin**
   - Navigate to Admin Dashboard
   
2. **Go to Staff Management**
   - Click on "Staff Management" in sidebar
   
3. **Add New Staff**
   - Click "Add Staff" button
   - Fill in required fields:
     - Full Name: "Test Teacher"
     - Email: "test@school.com"
     - Phone: "9800000000"
     - Position: "Teacher"
     - Department: "Science"
   
4. **Upload Image**
   - Click the file input under "Profile Image"
   - Select an image file (JPG, PNG, etc.)
   - **Expected**: Preview should appear immediately
   
5. **Submit**
   - Click "Create Staff Member"
   - **Expected**: Success message
   - **Check**: Image appears in the staff table with Photo column
   - **Check**: Visit Supabase Dashboard → Storage → staff-images
     - New file should be there with timestamp prefix

### Test 2: View Staff on Public Page 🌐

1. **Navigate to JKSS Staff Page**
   - Go to `/about/jkss-staffs`
   - **Expected**: All active staff members display
   - **Expected**: Test Teacher shows with uploaded image
   - **Expected**: Loading spinner shows first, then content

2. **Test Fallback Image**
   - Create staff without image
   - **Expected**: Default avatar (gray user icon) shows

### Test 3: Update Staff Image 🔄

1. **Edit Existing Staff**
   - Click edit icon on the Test Teacher entry
   - **Expected**: Current image shows in preview
   
2. **Change Image**
   - Select a different image file
   - **Expected**: New preview shows immediately
   
3. **Submit**
   - Click "Update Staff Member"
   - **Expected**: Success message
   - **Check**: New image appears in table
   - **Check**: Old image deleted from Supabase Storage
   - **Check**: Public page shows new image

### Test 4: Delete Staff 🗑️

1. **Delete Staff Member**
   - Click delete icon on Test Teacher
   - Confirm deletion
   
2. **Verify Cleanup**
   - **Check**: Staff removed from database
   - **Check**: Image file deleted from Supabase Storage
   - **Check**: Staff no longer appears on public page

### Test 5: Error Handling 🚨

#### Test 5a: File Too Large
- Try uploading file > 5MB
- **Expected**: Error message "File size must be less than 5MB"
- **Expected**: Upload prevented

#### Test 5b: Wrong File Type
- Try uploading a PDF or text file
- **Expected**: Error from multer "Only image files are allowed"
- **Expected**: Upload prevented

#### Test 5c: Missing Supabase Credentials
- Temporarily remove Supabase credentials from `.env`
- Restart backend
- Try uploading image
- **Expected**: Warning in backend console
- **Expected**: Error response to frontend

#### Test 5d: Network Error
- Stop backend server
- Try to load JKSS Staff page
- **Expected**: Error message "Failed to load team members"
- **Expected**: Retry button appears
- Click Retry after restarting backend
- **Expected**: Staff loads successfully

### Test 6: Image Display Quality 🎨

1. **Upload different image formats**
   - JPG/JPEG: Should work
   - PNG: Should work
   - GIF: Should work
   - WebP: Should work
   - SVG: Should work
   
2. **Check image quality**
   - In Staff Management table: Should be 40x40px circle
   - On Public Team page: Should be full-sized in card
   - Verify images are not blurry or distorted

### Test 7: Browser Compatibility 🌍

Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**All should**:
- Upload images successfully
- Show previews correctly
- Display images on public page

## 📊 Verification Checklist

After all tests, verify:

### Database
```sql
SELECT id, fullName, position, profileImage FROM staffs;
```
- [ ] `profileImage` column contains Supabase URLs
- [ ] URLs are in format: `https://[project].supabase.co/storage/v1/object/public/staff-images/[timestamp]-[filename]`

### Supabase Storage
- [ ] Bucket `staff-images` exists
- [ ] Bucket is public
- [ ] Files are named with timestamp prefix
- [ ] No orphaned files (files not in database)
- [ ] Deleted staff images are removed

### Frontend
- [ ] Admin can upload images
- [ ] Admin sees image previews
- [ ] Staff table shows profile photos
- [ ] Public page displays all staff with images
- [ ] Default avatar shows when no image
- [ ] Image errors handled gracefully

### Backend
- [ ] API accepts multipart/form-data
- [ ] MIME types set correctly
- [ ] Old images deleted on update
- [ ] Images deleted when staff deleted
- [ ] Proper error responses

## 🐛 Common Issues & Solutions

### Issue: Images not uploading
**Solution**:
1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Ensure bucket is public
4. Check file size < 5MB

### Issue: Images not displaying
**Solution**:
1. Check if URL saved in database
2. Verify bucket permissions
3. Check CORS settings in Supabase
4. Try accessing URL directly in browser

### Issue: Preview not showing
**Solution**:
1. Check file type is image
2. Verify FileReader is working
3. Check browser console for errors

### Issue: Old images not deleting
**Solution**:
1. Check backend logs
2. Verify deleteFromSupabase function
3. Check Supabase storage permissions
4. Ensure filename extraction works

## 📝 Test Data

Use these test images:
1. **Square Portrait**: 800x800px, JPG
2. **Rectangular**: 1000x600px, PNG
3. **Small**: 200x200px, WebP
4. **Large**: 2000x2000px (to test resize warning)

## ✅ Success Criteria

All tests pass when:
- [ ] Images upload successfully
- [ ] Previews show immediately
- [ ] Images display in staff table
- [ ] Public page shows all images
- [ ] Updates replace old images
- [ ] Deletes remove images from storage
- [ ] Error handling works
- [ ] File validation works
- [ ] Default avatars show when needed
- [ ] Performance is good (< 2s upload)

## 📞 Need Help?

If tests fail:
1. Check backend logs: Look for error messages
2. Check frontend console: Look for network errors
3. Check Supabase dashboard: Verify files uploaded
4. Review [STAFF_IMAGE_IMPLEMENTATION.md](STAFF_IMAGE_IMPLEMENTATION.md)

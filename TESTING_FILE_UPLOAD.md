# Testing File Upload for Announcements

## Quick Start Guide

### 1. Start the Backend Server
```bash
cd backend
npm install  # If not already installed
node app.js
```

Server should start on: `http://localhost:3000`
(Note: The code references port 3000, but your app.js shows port 4000. Make sure they match!)

### 2. Start the Frontend
```bash
cd frontend
npm install  # If not already installed
npm run dev
```

Frontend should start on: `http://localhost:5173`

### 3. Login as Admin
1. Navigate to admin login page
2. Enter admin credentials
3. Go to Announcements Management section

### 4. Test Creating Announcement with Files

**Steps:**
1. Click "New Announcement" button
2. Fill in:
   - Title: "Important Notice"
   - Content: "Please review the attached documents"
   - Priority: "High"
   - Target Audience: "All"
   - Start Date: Today's date
   - Check "Pin this announcement" (optional)

3. Upload Files:
   - Click the file upload area
   - Select 1-5 files (images or PDFs)
   - Maximum 10MB per file
   - Supported formats:
     - Images: JPEG, JPG, PNG, GIF, WEBP, SVG
     - Documents: PDF only

4. Click "Create Announcement"
5. Verify success message appears

**Expected Result:**
- Announcement appears in the list
- "Files" column shows the count (e.g., "2")
- Files are saved in `backend/uploads/announcements/`

### 5. Test Editing Announcement

**Steps:**
1. Click Edit button (pencil icon) on an announcement
2. Add new files or remove existing ones:
   - **To Remove:** Click the X button next to existing files
   - **To Restore:** Click "Restore" on marked files
   - **To Add:** Select new files from the upload area

3. Click "Update Announcement"

**Expected Result:**
- Removed files are deleted from disk
- New files are added
- Updated announcement reflects changes

### 6. Test Public View

**Steps:**
1. Open homepage in incognito/private window (or logout)
2. Announcements modal should appear automatically (if high/urgent priority)
3. Click on an announcement to expand
4. Scroll to attachments section

**Expected Result:**
- Attached files are listed with icons
- Images show image icon (🖼️)
- PDFs show document icon (📄)
- File sizes are displayed
- Clicking file opens it in new tab
- Download icon appears on hover

### 7. Test File Validation

**Test Invalid File Type:**
1. Try uploading a .txt, .docx, or .exe file
2. Should show: "Invalid file types: ... Only images and PDFs are allowed."

**Test Oversized File:**
1. Try uploading a file larger than 10MB
2. Should show: "Files too large: ... Maximum size is 10MB."

**Test Too Many Files:**
1. Try uploading more than 5 files
2. Should show: "Maximum 5 files allowed. Please remove some files first."

### 8. Test File Deletion on Announcement Delete

**Steps:**
1. Note the filenames in `backend/uploads/announcements/`
2. Delete an announcement that has files
3. Check the uploads folder again

**Expected Result:**
- Files associated with deleted announcement are removed
- Other announcements' files remain intact

### 9. Test Error Handling

**Test Backend Offline:**
1. Stop the backend server
2. Try to create/edit announcement
3. Should show: "Cannot connect to server. Please ensure the backend is running..."

**Test Network Error:**
1. Disconnect from network
2. Try to fetch announcements
3. Error banner should appear with "Try Again" button

## Verification Checklist

### Backend
- [ ] `uploads/announcements/` folder exists
- [ ] Files are saved with format: `timestamp-random-originalname`
- [ ] Files are served at `http://localhost:3000/uploads/announcements/{filename}`
- [ ] Deleted announcements remove their files
- [ ] Files are cleaned up on validation errors

### Frontend - Admin Panel
- [ ] File upload UI appears in create/edit modal
- [ ] Selected files show preview with icons
- [ ] File sizes are displayed correctly
- [ ] Remove/restore functionality works
- [ ] Validation messages appear for invalid files
- [ ] "Files" column shows count in data table
- [ ] FormData is sent instead of JSON

### Frontend - Public View
- [ ] Attached files appear in announcements modal
- [ ] Correct icons for images vs PDFs
- [ ] Files open in new tab when clicked
- [ ] Download icon shows on hover
- [ ] File sizes are readable (KB/MB)

## Common Issues

### Issue: Files not uploading
**Solution:** 
- Check if `backend/uploads/announcements/` directory exists
- Verify multer middleware is attached to routes
- Check file permissions on uploads folder

### Issue: 404 on file access
**Solution:**
- Verify static file serving in app.js: `app.use('/uploads', express.static(...))`
- Check file path in database matches actual file location
- Ensure backend server is running

### Issue: "Maximum file size exceeded"
**Solution:**
- Files must be ≤ 10MB
- Compress images before uploading
- Split large PDFs

### Issue: Frontend shows wrong port
**Solution:**
- Update API URLs in frontend to match backend port
- Current: `http://localhost:3000`
- Your backend runs on: Port 4000 (check app.js)
- Update frontend API calls if needed

### Issue: CORS errors
**Solution:**
- Check CORS configuration in `backend/app.js`
- Current setting allows all origins (`origin: '*'`)
- Ensure frontend origin is allowed

## Port Configuration Alert

⚠️ **Important:** The backend code shows `app.listen(4000)` but frontend API calls use port 3000. 

**Fix this by either:**

**Option 1: Update backend to port 3000**
```javascript
// backend/app.js
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

**Option 2: Update frontend API URLs**
```typescript
// Search and replace in frontend files
// Old: http://localhost:3000
// New: http://localhost:4000
```

## Sample Test Data

### Test Announcement 1
```
Title: School Closure Notice
Content: School will be closed on Friday for annual maintenance. Please review the attached schedule for make-up classes.
Priority: Urgent
Files: schedule.pdf (2 MB)
```

### Test Announcement 2
```
Title: Annual Day Celebration
Content: Join us for our annual day celebration. See attached invitation and event program.
Priority: High
Files: invitation.jpg (500 KB), program.pdf (1.5 MB)
```

### Test Announcement 3
```
Title: Exam Results Published
Content: The exam results for Term 1 are now available. Please check the attached result sheet.
Priority: Medium
Files: results.pdf (3 MB)
```

## Success Criteria

✅ Files upload successfully with proper validation
✅ Multiple files can be attached (up to 5)
✅ Files are displayed in both admin and public views
✅ Files can be downloaded/viewed
✅ Editing preserves existing files and allows adding/removing
✅ Deleting announcements cleans up files
✅ Error messages are clear and helpful
✅ No orphaned files remain after operations

## Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Check backend terminal for error logs
3. Verify file permissions on uploads folder
4. Ensure all dependencies are installed
5. Check that ports match between frontend and backend

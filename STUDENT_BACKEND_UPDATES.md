# Student Management System - Backend Updates

## Overview
The backend has been updated to support the enhanced student management system with cascading address dropdowns for Nepal's administrative divisions and foreign student support.

## Changes Made

### 1. Student Model (`backend/src/database/models/studentModel.js`)
**Updated Fields:**
- ✅ Added name fields: `firstName`, `middleName`, `lastName`, `nationalIdNumber`
- ✅ Added `iemisId` (unique identifier for IEMIS system)
- ✅ Added `isForeignStudent` boolean flag
- ✅ Added permanent address fields: `permanentProvince`, `permanentDistrict`, `permanentMunicipality`, `permanentWard`
- ✅ Added temporary address fields: `temporaryProvince`, `temporaryDistrict`, `temporaryMunicipality`, `temporaryWard`
- ✅ Added `sameAsPermAddress` boolean
- ✅ Added family fields: `fatherName`, `motherName`, `guardianContactNo`
- ✅ Added academic fields: `admitYear`, `subject`
- ✅ Added personal details: `caste`, `motherTongue`, `disabilityType`
- ✅ Added school info: `schoolingSource`, `scholarship`
- ✅ Added `photo` field for profile images
- ✅ Added `contactNumber` for student contact

### 2. Student Controller (`backend/src/controllers/studentController.js`)
**Updated Functions:**
- ✅ `createStudent()`: Now handles all new fields + photo upload to Supabase
- ✅ `updateStudent()`: Now handles all new fields + photo upload/replacement to Supabase
- ✅ Both functions auto-generate `fullName` from firstName, middleName, lastName

**New Features:**
- Photo uploads to Supabase `student-images` bucket
- Automatic deletion of old photos when updating
- Error handling for upload failures (continues without photo rather than failing)

### 3. Upload Middleware (`backend/src/middlewares/studentUploadMiddleware.js`)
**New File Created:**
- Handles multipart/form-data with photo upload
- Validates image types (jpeg, jpg, png, gif, webp)
- 2MB file size limit (matches frontend)
- Uses memory storage for direct Supabase upload

### 4. Routes (`backend/src/routes/studentRoute.js`)
**Updated Endpoints:**
- `POST /students/create` - Now includes `studentUpload` middleware
- `PUT /students/:id/update` - Now includes `studentUpload` middleware
- `DELETE /students/:id/delete` - Unchanged

## Database Migration Required

### 📋 Run Migration
Execute the SQL script to add new columns to your database:

```bash
# Location: backend/src/database/migrations/update_students_table.sql
```

**OR** use Sequelize auto-sync (if configured):
```javascript
// In your backend startup code
await sequelize.sync({ alter: true });
```

⚠️ **Important:** 
- The `ALTER TABLE` statements are safe and won't delete existing data
- New columns will be added with NULL/default values
- Existing students will need their data updated

### 📊 What the Migration Does:
1. Adds all new columns to `students` table
2. Creates indexes on frequently queried fields
3. Adds column comments for documentation
4. Preserves all existing data

## Supabase Storage Setup

### Required Bucket
The `student-images` bucket should already exist (as per CREATE_SUPABASE_BUCKETS.md).

If not, create it:
1. Go to Supabase Dashboard → Storage
2. Create new bucket: `student-images`
3. Make it **PUBLIC**
4. Set file size limit: **2 MB**
5. Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`

## API Request Format

### Create Student
```
POST /students/create
Content-Type: multipart/form-data
Authorization: Bearer <admin-token>

Fields:
- firstName (required)
- lastName (required)
- middleName (optional)
- class (required)
- isForeignStudent (boolean)
- permanentProvince (required if not foreign)
- permanentDistrict (required if not foreign)
- permanentMunicipality (required if not foreign)
- permanentWard (required if not foreign)
- temporaryProvince (required)
- temporaryDistrict (required)
- temporaryMunicipality (required)
- temporaryWard (required)
- photo (file - optional)
- ... all other fields
```

### Update Student
```
PUT /students/:id/update
Content-Type: multipart/form-data
Authorization: Bearer <admin-token>

Same fields as create (all optional for update)
```

## Frontend-Backend Alignment

### ✅ Fully Compatible
The backend now supports all fields sent by the frontend:
- Cascading address fields (province → district → local body → ward)
- Foreign student flag
- Photo upload with preview
- Extended personal and academic information
- IEMIS ID system

### Field Mapping
| Frontend Field | Backend Field | Type |
|----------------|---------------|------|
| `firstName` | `firstName` | String |
| `middleName` | `middleName` | String |
| `lastName` | `lastName` | String |
| `isForeignStudent` | `isForeignStudent` | Boolean |
| `permanentProvince` | `permanentProvince` | String |
| `permanentDistrict` | `permanentDistrict` | String |
| `permanentMunicipality` | `permanentMunicipality` | String |
| `permanentWard` | `permanentWard` | String |
| `temporaryProvince` | `temporaryProvince` | String |
| `temporaryDistrict` | `temporaryDistrict` | String |
| `temporaryMunicipality` | `temporaryMunicipality` | String |
| `temporaryWard` | `temporaryWard` | String |
| `photo` (file) | `photo` (URL) | File → String |

## Testing Checklist

### Before Testing
- [ ] Run database migration script
- [ ] Verify Supabase credentials in `.env`
- [ ] Confirm `student-images` bucket exists and is public
- [ ] Restart backend server

### Test Cases
1. **Create Regular Student** (Nepali)
   - [ ] Fill all required fields
   - [ ] Select province → district → municipality → ward
   - [ ] Upload photo
   - [ ] Verify data saved correctly
   - [ ] Verify photo uploaded to Supabase

2. **Create Foreign Student**
   - [ ] Check "Is Foreign Student"
   - [ ] Verify permanent address fields are hidden
   - [ ] Fill only temporary address (current address in Nepal)
   - [ ] Upload photo
   - [ ] Verify data saved correctly

3. **Update Student**
   - [ ] Update existing student
   - [ ] Change photo
   - [ ] Verify old photo deleted from Supabase
   - [ ] Verify new photo uploaded

4. **Error Handling**
   - [ ] Try uploading file > 2MB (should fail)
   - [ ] Try uploading non-image file (should fail)
   - [ ] Create student without photo (should succeed)

## Environment Variables Required

```env
# Database
db_string=postgresql://user:password@host:port/database

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Next Steps

1. ✅ Backend model updated
2. ✅ Backend controller updated
3. ✅ Upload middleware created
4. ✅ Routes updated
5. 🔄 **Run database migration** (PENDING)
6. 🔄 **Test API endpoints** (PENDING)
7. 🔄 **Verify Supabase storage** (PENDING)

## Troubleshooting

### Issue: "Supabase is not configured"
**Solution:** Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env`

### Issue: "student-images bucket not found"
**Solution:** Create the bucket in Supabase Dashboard

### Issue: "Column does not exist"
**Solution:** Run the migration script `update_students_table.sql`

### Issue: "File too large"
**Solution:** Frontend validates 2MB, but check if file is actually larger

### Issue: "fullName is null"
**Solution:** Ensure firstName and lastName are provided in the request

## Notes
- The `fullName` field is auto-generated from firstName + middleName + lastName
- Legacy `address` field is kept for backward compatibility
- Both `guardianPhone` and `guardianContactNo` supported for compatibility
- Photo uploads are optional - student can be created without a photo
- Foreign students only need temporary address (current address in Nepal)

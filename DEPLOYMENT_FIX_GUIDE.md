# Student Management - Deployment Fix Guide

## Issue: 404 Error on POST /api/students/create

### Root Causes
1. ✅ Routes updated correctly in code
2. ⚠️ **Vercel deployment needs update** - old code still deployed
3. ⚠️ **Database columns missing** - new fields don't exist in production DB
4. ⚠️ **Environment variable needed** - to trigger schema update

---

## Quick Fix Steps

### Step 1: Add Environment Variable to Vercel
1. Go to your Vercel project dashboard: `jkssp5server`
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `SYNC_DB`
   - **Value**: `true`
   - **Environment**: Production
4. Click **Save**

> This will trigger database schema update on next deployment

### Step 2: Redeploy to Vercel

**Option A: Push to GitHub (Recommended)**
```bash
cd "d:\Janakalyan Ma Vi\JKS_School_Babai5\backend"
git add .
git commit -m "Update student management with cascading address fields"
git push origin main
```

**Option B: Manual Redeploy from Vercel Dashboard**
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click **"Redeploy"** button
4. Wait for deployment to complete (~2-3 minutes)

### Step 3: Test the API
After deployment completes, test if columns were added:
```bash
# Check health endpoint
curl https://jkssp5server.vercel.app/health
```

### Step 4: Disable Auto-Sync (After First Deploy)
⚠️ **IMPORTANT**: After the first successful deployment with new columns:

1. Go back to Vercel → Settings → Environment Variables
2. **Delete** or set `SYNC_DB` to `false`
3. Redeploy once more

> This prevents schema changes on every request, which could slow down your serverless functions

---

## Alternative: Manual Database Migration

If you prefer not to use auto-sync, run the SQL migration manually:

### Using Supabase Dashboard
1. Go to your Supabase project
2. Click **SQL Editor**
3. Copy and paste the entire contents of:
   ```
   backend/src/database/migrations/update_students_table.sql
   ```
4. Click **Run**
5. Verify columns were added:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'students' 
   ORDER BY ordinal_position;
   ```

### Then Deploy WITHOUT Sync
1. Remove `SYNC_DB` environment variable from Vercel
2. Deploy normally
3. The columns already exist, so sync isn't needed

---

## Verification Checklist

After deployment, verify everything works:

### 1. Check Backend is Live
```bash
curl https://jkssp5server.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "env": {
    "NODE_ENV": "production",
    "hasDbString": true,
    "hasJwtSecret": true,
    "hasSupabaseUrl": true,
    "hasSupabaseKey": true
  }
}
```

### 2. Check Routes are Available
```bash
# List all students (should work even before update)
curl https://jkssp5server.vercel.app/api/students
```

### 3. Test Student Creation from Frontend
1. Go to your admin panel: `https://jkssp5padampur.vercel.app/admin/students`
2. Click **"Add Student"**
3. Fill in the form
4. Upload a photo (optional)
5. Click **Save**

If successful, you should see:
- Success message
- Student appears in the table
- Photo uploaded to Supabase

---

## Common Issues After Deployment

### Issue: Still Getting 404
**Solution**: 
- Clear browser cache
- Check Vercel deployment logs for errors
- Verify the deployment used the latest commit

### Issue: "Column does not exist" Error
**Solution**:
- Columns weren't added - run manual migration
- OR ensure `SYNC_DB=true` was set before deployment
- Check Vercel function logs

### Issue: "Supabase is not configured"
**Solution**:
- Verify environment variables in Vercel:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Redeploy after adding them

### Issue: Photo Upload Fails
**Solution**:
- Create `student-images` bucket in Supabase
- Make bucket **PUBLIC**
- Check Supabase credentials are correct

### Issue: Foreign Student Form Not Working
**Solution**:
- Frontend should hide permanent address when "Is Foreign Student" is checked
- If not working, clear browser cache and reload

---

## Environment Variables Reference

Your Vercel backend should have these variables:

```env
# Database (Required)
db_string=postgresql://...

# JWT (Required)
JWT_SECRET=your-secret-key

# Supabase Storage (Required for photo uploads)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Temporary - for first deployment only
SYNC_DB=true  # Remove after first deployment
```

---

## Rollback Plan

If something goes wrong:

```bash
# Revert to previous deployment in Vercel dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
```

Or manually run reverse migration:
```sql
-- Remove new columns if needed
ALTER TABLE students 
DROP COLUMN IF EXISTS "firstName",
DROP COLUMN IF EXISTS "lastName",
-- ... (etc)
```

---

## Next Steps After Successful Deployment

1. ✅ Test creating Nepali students with cascading address
2. ✅ Test creating foreign students (only temporary address)
3. ✅ Test uploading student photos
4. ✅ Test updating existing students
5. ✅ Remove `SYNC_DB` environment variable
6. ✅ Set `alter: true` back to `alter: false` in connection.js (optional)
7. ✅ Commit and push final production-ready code

---

## Support

If issues persist after following this guide:

1. **Check Vercel Function Logs**:
   - Vercel Dashboard → Your Project → Logs
   - Look for errors during deployment or runtime

2. **Check Browser Console**:
   - F12 → Console tab
   - Look for detailed error messages

3. **Verify Database Connection**:
   - Ensure `db_string` is correct
   - Test connection from local environment first

4. **Check All Files Updated**:
   - studentModel.js ✅
   - studentController.js ✅
   - studentRoute.js ✅
   - studentUploadMiddleware.js ✅
   - connection.js ✅

Good luck! 🚀

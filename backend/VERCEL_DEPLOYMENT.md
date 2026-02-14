# Backend Vercel Deployment Guide

## Overview
This guide explains how to deploy the JKS School backend API to Vercel as a serverless function.

## Changes Made for Vercel Compatibility

### 1. **Serverless Function Configuration**
- Created `vercel.json` with proper routing configuration
- Modified `app.js` to export the Express app for Vercel
- Conditional server listening (only runs locally, not on Vercel)

### 2. **File Upload Middleware Updates**
Converted all upload middlewares from `diskStorage` to `memoryStorage`:
- ✅ `messageUploadMiddleware.js`
- ✅ `galleryUploadMiddleware.js`
- ✅ `blogUploadMiddleware.js`
- ✅ `announcementUploadMiddleware.js`
- ✅ `careerUploadMiddleware.js`

**Reason**: Vercel serverless functions have read-only file systems. Files are now stored in memory as buffers and uploaded directly to Supabase Storage.

## Environment Variables Required

Configure these in **Vercel Project Settings → Environment Variables**:

### Database
```
db_string=postgresql://username:password@host:port/database?sslmode=require
```

### Authentication
```
JWT_SECRET=your_secure_jwt_secret_minimum_64_characters_long
```

### Supabase Storage (for file uploads)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Node Environment
```
NODE_ENV=production
```

## Deployment Steps

### 1. **Push Code to Git Repository**
```bash
cd backend
git add .
git commit -m "Configure backend for Vercel serverless deployment"
git push origin main
```

### 2. **Deploy to Vercel**

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Add environment variables (see above)
6. Click "Deploy"

### 3. **Configure Environment Variables**
In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add all required variables for:
   - Production
   - Preview (optional)
   - Development (optional)

## Database Configuration

### PostgreSQL Connection String Format
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### Example (Supabase PostgreSQL)
```
postgresql://postgres.abcdefgh:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Important**: Use the **Connection Pooler** URL from Supabase (not direct connection) to avoid connection limit issues in serverless environments.

## Supabase Storage Configuration

### 1. Get Supabase Credentials
From your Supabase project dashboard:
- **URL**: Project Settings → API → Project URL
- **Service Role Key**: Project Settings → API → service_role key

### 2. Create Storage Buckets
Required buckets (create in Supabase Dashboard → Storage):
- `staff-images`
- `blog-images`
- `announcements`
- `gallery`
- `downloads`
- `hero-slides`
- `messages`
- `career-notices`
- `career-resumes`

### 3. Configure Bucket Policies
Make buckets publicly readable:
```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('staff-images', 'staff-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Repeat for all buckets
```

## Testing Deployment

### 1. **Check Deployment Status**
```bash
vercel logs
```

### 2. **Test API Endpoint**
```bash
curl https://your-backend.vercel.app/
# Expected: "Welcome to the JKS School API"
```

### 3. **Test Specific Route**
```bash
curl https://your-backend.vercel.app/api/school-profile
```

## Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"
**Causes**:
- Missing environment variables
- Database connection failure
- Incorrect `vercel.json` configuration

**Solution**:
1. Check Vercel logs: `vercel logs --follow`
2. Verify all environment variables are set
3. Test database connection string locally

### Error: "Database connection timeout"
**Cause**: Using direct PostgreSQL connection instead of pooler

**Solution**: 
- Use Supabase Connection Pooler URL
- Format: `postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres`

### Error: "Cannot read property 'buffer' of undefined"
**Cause**: File upload middleware not configured correctly

**Solution**:
- Ensure all upload middlewares use `memoryStorage()`
- Access uploaded file via `req.file.buffer` (not `req.file.path`)

### Error: "ENOENT: no such file or directory"
**Cause**: Code trying to access local file system

**Solution**:
- Remove all `fs.mkdirSync()`, `fs.writeFileSync()` operations
- Use Supabase storage for all file operations
- Files in `/uploads` directory won't work on Vercel

### Warning: "Serverless Function size limit"
**Cause**: Dependencies too large (>50MB)

**Solution**:
- Review `package.json` dependencies
- Remove unused packages
- Consider using external services for heavy operations

## Local Development

The app now works both locally and on Vercel:

```bash
# Local development (listens on port 4000)
npm start

# The condition in app.js:
# if (process.env.NODE_ENV !== 'production') {
#   app.listen(4000, ...)
# }
```

## API Base URL

After deployment, update frontend API configuration:

```typescript
// frontend/src/api/client.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend.vercel.app'
  : 'http://localhost:4000';
```

## Connection Limits

Serverless functions create new database connections on each request. To avoid connection limits:

1. **Use Connection Pooling**: Supabase Pooler URL
2. **Enable Connection Reuse**: Already configured in Sequelize
3. **Set Connection Limits**:
```javascript
const sequelize = new Sequelize(process.env.db_string, {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
```

## Monitoring

### Vercel Analytics
- View in Vercel Dashboard → Analytics
- Monitor function execution time
- Track errors and crashes

### Logs
```bash
# Real-time logs
vercel logs --follow

# Last 100 logs
vercel logs --limit 100
```

## Summary

✅ **Modified Files**:
- `app.js` - Added module export and conditional listening
- `vercel.json` - Created serverless configuration
- 5 upload middleware files - Converted to memoryStorage

✅ **Required Environment Variables**: 4
- `db_string`
- `JWT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

✅ **Ready for Deployment**: Yes

## Next Steps

1. Set up environment variables in Vercel
2. Create Supabase storage buckets
3. Deploy to Vercel
4. Update frontend API URL
5. Test all endpoints

## Support

For issues:
1. Check Vercel logs
2. Verify environment variables
3. Test database connectivity
4. Review Supabase storage configuration

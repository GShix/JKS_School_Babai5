# Create Missing Supabase Storage Buckets

## Overview
Your code is already configured to use Supabase Storage for file uploads. However, you need to create the following buckets in your Supabase project to make announcements and gallery images/videos work.

## Buckets You Already Have ✅
- `hero-slides` (PUBLIC)
- `downloads` (PUBLIC)
- `blog-images` (PUBLIC)
- `student-images` (PUBLIC)
- `staff-images` (PUBLIC)

## Buckets You Need to Create 🆕

### 1. announcements
For announcement attachments (images and PDFs)

### 2. gallery-images
For gallery images

### 3. gallery-videos
For gallery videos

---

## Step-by-Step Guide to Create Buckets

### 1. Go to Your Supabase Project
1. Open https://app.supabase.com/
2. Select your project: `Janakalyan_MaVi`

### 2. Navigate to Storage
1. Click on **Storage** in the left sidebar
2. Click on **New bucket** button (green button in top right)

### 3. Create Each Bucket

#### Create `announcements` Bucket
1. Click **New bucket**
2. **Name**: `announcements`
3. **Public bucket**: ✅ Check this box (so files are publicly accessible)
4. **File size limit**: `10 MB`
5. **Allowed MIME types**: 
   - `image/jpeg`
   - `image/jpg`
   - `image/png`
   - `image/gif`
   - `image/webp`
   - `image/svg+xml`
   - `application/pdf`
6. Click **Create bucket**

#### Create `gallery-images` Bucket
1. Click **New bucket**
2. **Name**: `gallery-images`
3. **Public bucket**: ✅ Check this box
4. **File size limit**: `5 MB`
5. **Allowed MIME types**:
   - `image/jpeg`
   - `image/jpg`
   - `image/png`
   - `image/gif`
   - `image/webp`
   - `image/svg+xml`
6. Click **Create bucket**

#### Create `gallery-videos` Bucket
1. Click **New bucket**
2. **Name**: `gallery-videos`
3. **Public bucket**: ✅ Check this box
4. **File size limit**: `1024 MB` (1 GB)
5. **Allowed MIME types**:
   - `video/mp4`
   - `video/mpeg`
   - `video/quicktime`
   - `video/x-msvideo`
   - `video/webm`
6. Click **Create bucket**

---

## 4. Verify Bucket Policies (Make Public)

For each bucket you created, ensure it's publicly accessible:

1. Click on the bucket name
2. Go to **Policies** tab
3. If no policies exist, click **New policy**
4. Select **Enable access to all users** (for public read access)
5. Or use this RLS policy:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'announcements' );
   
   -- Allow authenticated uploads
   CREATE POLICY "Authenticated Upload"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'announcements' AND auth.role() = 'authenticated' );
   ```
   (Replace `announcements` with the respective bucket name)

---

## 5. Update Vercel Environment Variables

Make sure your **backend** deployment on Vercel has these environment variables set:

1. Go to https://vercel.com/
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Ensure these are set:
   - `SUPABASE_URL`: `https://sttyojakdedoumuqybtm.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your service role key)

5. After adding/verifying, **redeploy** your backend

---

## 6. Test the Setup

1. Deploy your updated backend code to Vercel
2. Go to your frontend admin panel
3. Try uploading:
   - An announcement with image/PDF attachment
   - A gallery item with images
4. Check if the files appear in Supabase Storage buckets
5. Check if the files are visible on your frontend

---

## Troubleshooting

### Images still not showing?
1. Verify buckets are **PUBLIC** (check the PUBLIC badge in Supabase)
2. Verify environment variables are set on Vercel
3. Redeploy your backend after setting env vars
4. Check browser console for CORS errors
5. Verify file URLs in your database match Supabase public URLs

### Upload fails?
1. Check file size limits
2. Check allowed MIME types
3. Check Supabase Storage quota (free tier has limits)
4. Check backend logs for error messages

---

## Summary

After completing these steps:
- ✅ Announcements with attachments will work
- ✅ Gallery images will work
- ✅ Gallery videos will work
- ✅ All files will be served from Supabase (not local /uploads)
- ✅ Files will persist across Vercel deployments

Your app will be fully functional on Vercel! 🎉

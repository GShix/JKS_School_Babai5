# 🚀 Quick Setup Guide - Fixing Supabase Configuration

## The Error You're Seeing

```
Error: supabaseUrl is required.
```

This means you need to configure your Supabase credentials. Don't worry - the app will work fine for everything except image uploads until you set this up!

## ✅ Quick Fix (2 Options)

### Option 1: Use Supabase (Recommended for Production)

#### Step 1: Create `.env` file
```bash
cd backend
cp .env.example .env
```

Or manually create `backend/.env` file if it doesn't exist.

#### Step 2: Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in (it's free!)
3. Create a new project
4. Wait for project to be ready (~2 minutes)
5. Go to **Settings** → **API**
6. Copy:
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_ANON_KEY`

#### Step 3: Update `.env` file

```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Supabase Configuration (REPLACE THESE!)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...

# Server Configuration
PORT=4000
NODE_ENV=development
```

#### Step 4: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name: `staff-images`
4. **Make it Public** (toggle the public option)
5. Click **Create bucket**

#### Step 5: Restart Backend

```bash
# The server should auto-restart with nodemon
# Or manually restart:
npm start
```

You should see: ✅ `Supabase client initialized successfully`

---

### Option 2: Run Without Supabase (Local Development Only)

If you just want to run the app without image uploads for now:

#### Create minimal `.env` file

```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Supabase - Leave empty for now (images won't upload)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Server Configuration
PORT=4000
NODE_ENV=development
```

**Note**: The app will start normally, but:
- ⚠️ You'll see a warning: "Supabase credentials not configured"
- ✅ Everything works except image uploads
- ❌ Trying to upload images will show an error

---

## 🎯 Recommended Setup (Full Features)

For the best experience with all features working:

1. **Use Option 1** (Set up Supabase - it's free!)
2. **Why?** 
   - Profile images work properly
   - Staff photos display on public page
   - Professional cloud storage
   - No local file management issues

## 📝 Current Configuration Status

The code has been updated to:
- ✅ **Not crash** if Supabase is missing
- ✅ **Show warnings** instead of errors
- ✅ **Work normally** for all non-image features
- ✅ **Gracefully fail** with helpful error message if you try to upload without Supabase

## 🧪 Test Your Setup

After configuring, test with:

```bash
# Start backend
cd backend
npm start

# You should see:
# ✅ Supabase client initialized successfully
# (instead of ⚠️ warning)
```

Then test image upload:
1. Login as admin
2. Go to Staff Management
3. Add new staff with image
4. Should upload successfully!

## ❓ Troubleshooting

### Still getting errors?

1. **Check `.env` file location**
   - Must be in `backend/.env` (not root folder)
   
2. **Check `.env` values**
   - No quotes around values
   - No spaces before/after `=`
   - URLs should start with `https://`
   
3. **Restart backend**
   - Save `.env` file
   - Backend should auto-restart
   - Or manually restart: `npm start`

4. **Verify Supabase project**
   - Project must be active (green status)
   - Bucket must exist and be public

### Need help?

Check these files:
- [STAFF_IMAGE_UPLOAD_GUIDE.md](STAFF_IMAGE_UPLOAD_GUIDE.md) - Detailed guide
- [STAFF_IMAGE_IMPLEMENTATION.md](STAFF_IMAGE_IMPLEMENTATION.md) - Technical docs
- [TESTING_STAFF_IMAGES.md](TESTING_STAFF_IMAGES.md) - Testing guide

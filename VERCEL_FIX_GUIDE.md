# Vercel Deployment Fix Guide

## Issues Fixed

### 1. ✅ Fixed Module Path Error
**Error:** `Cannot find module '../src/app.js'`
**Fix:** Updated `backend/api/index.js` to use the correct path and CommonJS syntax

### 2. ✅ Fixed Package Configuration
**Error:** `Please install pg package manually`
**Fixes Applied:**
- Added `builds` configuration in `vercel.json`
- Updated `package.json` with correct entry point
- Moved `nodemon` to `devDependencies`
- Added Node.js engine specification

### 3. ⚠️ Environment Variables Missing
**Error:** `[dotenv@17.2.4] injecting env (0) from .env`
**Action Required:** You need to set environment variables in Vercel

---

## REQUIRED ACTIONS

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

#### Required Variables:

1. **Database Connection**
   ```
   db_string = postgresql://username:password@host:port/database?sslmode=require
   ```
   - Get this from your database provider (Supabase, Railway, etc.)

2. **JWT Secret**
   ```
   JWT_SECRET = your-super-secret-key-change-this
   ```
   - Use a strong random string (at least 32 characters)

3. **Supabase Configuration**
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_ANON_KEY = your-anon-key
   ```
   - Or use `SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_ANON_KEY`

4. **Node Environment** (Optional)
   ```
   NODE_ENV = production
   ```

#### Optional Variables:

```
JWT_EXPIRES_IN = 7d
PORT = 4000
```

### Step 2: How to Add Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `db_string`)
   - **Value**: Variable value
   - **Environments**: Select `Production`, `Preview`, and `Development`
5. Click **Save**

### Step 3: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** → **Use Existing Build Cache** (uncheck it)
4. Click **Redeploy**

Or simply push a new commit to trigger a fresh deployment.

---

## Files Modified

### 1. `backend/api/index.js`
Changed from ES6 imports to CommonJS and fixed path:
```javascript
// OLD (wrong path and syntax)
import app from '../src/app.js';
export default app;

// NEW (correct path and syntax)
const app = require('../app.js');
module.exports = app;
```

### 2. `backend/vercel.json`
Added builds configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [...]
}
```

### 3. `backend/package.json`
- Changed `main` to `"api/index.js"`
- Added `engines` field for Node.js version
- Moved `nodemon` to `devDependencies`

---

## Verification Steps

After redeployment, verify these:

### 1. Check Build Logs
Look for:
- ✅ `Installing dependencies...` (should install pg package)
- ✅ `Build Completed`
- ❌ No module errors

### 2. Check Function Logs
In Vercel dashboard → Functions → View Function Logs:
- ✅ `Database connection established successfully`
- ❌ No "Please install pg package" errors
- ❌ No "db_string environment variable is not set" errors

### 3. Test API Endpoints
Try accessing:
- `https://your-domain.vercel.app/api/school-profile`
- `https://your-domain.vercel.app/api/announcements`

Should return JSON data, not 500 errors.

---

## Common Issues & Solutions

### Issue: "pg package" error persists
**Solution:** Clear build cache and redeploy
1. Redeploy with build cache disabled
2. Or delete and recreate the project

### Issue: Database connection fails
**Solution:** Check your `db_string` environment variable
- Ensure it's in the correct format
- Test connection with a tool like `psql` or database client
- Ensure database allows connections from Vercel IPs

### Issue: CORS errors
**Solution:** Update backend CORS configuration
- Check `backend/app.js` CORS settings
- Ensure your frontend domain is allowed

### Issue: Environment variables not loading
**Solution:** 
- Verify variables are set for "Production" environment
- After adding variables, always redeploy
- Check variable names match exactly (case-sensitive)

---

## Database Connection String Format

Your `db_string` should look like:

**Supabase:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Railway:**
```
postgresql://postgres:[password]@containers-us-west-xxx.railway.app:7890/railway
```

**Render:**
```
postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com/dbname
```

Always include `?sslmode=require` or configure SSL in dialectOptions.

---

## Need Help?

If you encounter issues:
1. Check Vercel Function Logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure your database is accessible from Vercel
4. Test with a minimal API endpoint first

---

## Next Steps

After successful deployment:
1. Update frontend `VITE_API_BASE_URL` to point to your Vercel backend
2. Test all API endpoints
3. Monitor function logs for any errors
4. Set up proper error monitoring (optional: Sentry, LogRocket, etc.)

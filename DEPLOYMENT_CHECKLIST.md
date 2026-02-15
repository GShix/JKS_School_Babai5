# Vercel Deployment Checklist

## ✅ Files Already Fixed (No Action Needed)

- [x] `backend/api/index.js` - Fixed module path and syntax
- [x] `backend/vercel.json` - Added builds configuration
- [x] `backend/package.json` - Updated entry point and dependencies
- [x] `backend/.env.example` - Created for reference

---

## ⚠️ REQUIRED ACTIONS

### 1. Set Environment Variables in Vercel Dashboard

**Go to:** [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables

**Add these variables:**

| Variable Name | Example Value | Where to Get It |
|--------------|---------------|-----------------|
| `db_string` | `postgresql://user:pass@host:5432/db` | Your database provider |
| `JWT_SECRET` | `super-secret-key-min-32-chars` | Generate a random string |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Dashboard |
| `SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase Dashboard → Settings → API |
| `NODE_ENV` | `production` | Just type this |

**Important:** 
- Select all environments: Production, Preview, Development
- Click Save after each variable

### 2. Get Your Database Connection String

#### If using Supabase:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection String** → **URI**
5. Copy the connection string (it starts with `postgresql://`)
6. Replace `[YOUR-PASSWORD]` with your actual database password

#### If using Railway/Render:
- Copy the PostgreSQL connection URL from your database settings

### 3. Get Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → use as `SUPABASE_URL`
   - **anon public** key → use as `SUPABASE_ANON_KEY`

### 4. Generate JWT Secret

Use this command to generate a secure random string:

**Windows PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**macOS/Linux:**
```bash
openssl rand -base64 32
```

Or use an online generator: [RandomKeygen.com](https://randomkeygen.com/)

### 5. Redeploy on Vercel

After adding all environment variables:

**Option A: Via Dashboard**
1. Go to **Deployments** tab
2. Click latest deployment → **Redeploy**
3. ⚠️ **Uncheck** "Use existing build cache"
4. Click **Redeploy**

**Option B: Via Git Push**
```bash
git add .
git commit -m "Update environment configuration"
git push
```

---

## 🧪 Testing After Deployment

### 1. Check Build Logs
✅ Look for: `Build Completed`
❌ Should NOT see: `Cannot find module` or `Please install pg package`

### 2. Test API Endpoints

Open these URLs in your browser (replace with your domain):

```
https://your-project.vercel.app/api/school-profile
https://your-project.vercel.app/api/announcements
```

**Expected:** JSON response with data
**Not Expected:** 500 error or blank page

### 3. Check Function Logs

In Vercel Dashboard:
1. Go to **Deployments** → Click latest deployment
2. Click **View Function Logs**
3. Look for: `✅ Database connection established successfully`

---

## ❌ Troubleshooting

### Error: "Database connection string is required"
- **Fix:** Add `db_string` environment variable in Vercel
- **Verify:** The variable name is exactly `db_string` (case-sensitive)

### Error: "Please install pg package"
- **Fix:** Redeploy with build cache disabled
- **How:** Deployments → Redeploy → Uncheck "Use existing build cache"

### Error: CORS issues from frontend
- **Fix:** Check your backend is allowing your frontend domain
- **Current:** Backend allows all origins (`origin: '*'`)

### Error: 500 on all endpoints
- **Fix:** Check Function Logs for specific error
- **Usually:** Missing environment variable

---

## 📋 Quick Verification Checklist

Before considering deployment successful:

- [ ] All 4-5 environment variables added in Vercel
- [ ] Environment variables saved for "Production"
- [ ] Redeployed after adding variables
- [ ] Build completed without errors
- [ ] At least one API endpoint returns data (not 500)
- [ ] Function logs show database connection success
- [ ] No "pg package" errors in logs

---

## 🎯 Priority Order

Do these in order:

1. **First:** Add `db_string` environment variable
2. **Second:** Add `JWT_SECRET` environment variable
3. **Third:** Add Supabase variables (`SUPABASE_URL` and `SUPABASE_ANON_KEY`)
4. **Fourth:** Add `NODE_ENV=production`
5. **Finally:** Redeploy

---

## 📞 Need Help?

Reference files:
- [VERCEL_FIX_GUIDE.md](./VERCEL_FIX_GUIDE.md) - Detailed explanation
- [backend/.env.example](./backend/.env.example) - Environment variables template
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - Frontend environment setup

Common resources:
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)
- Database connection string format in VERCEL_FIX_GUIDE.md

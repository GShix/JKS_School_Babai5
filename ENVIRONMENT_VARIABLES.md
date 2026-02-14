# Environment Variables Setup

## Quick Setup for Production

### 1. Frontend Environment Variables

Create or update `frontend/.env`:

**For Local Development:**
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SERVER_URL=http://localhost:4000
VITE_ENV=development
```

**For Production:**
```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_SERVER_URL=https://your-domain.com
VITE_ENV=production
```

### 2. Understanding the Variables

- **VITE_API_BASE_URL**: Full URL to your backend API (includes `/api`)
  - Used for: API calls (login, fetch data, etc.)
  - Example: `https://api.yourschool.com/api`

- **VITE_SERVER_URL**: Base server URL (without `/api`)
  - Used for: File downloads, image URLs, static assets
  - Example: `https://api.yourschool.com`

- **VITE_ENV**: Environment mode
  - Values: `development` or `production`

### 3. How It Works

The code now uses these variables instead of hardcoded `http://localhost:4000`:

**Before:**
```typescript
link.href = `http://localhost:4000${fileUrl}`  // ❌ Won't work in production
```

**After:**
```typescript
import { SERVER_URL } from '../../api/config'
link.href = `${SERVER_URL}${fileUrl}`  // ✅ Works everywhere
```

### 4. Building for Production

When you build your frontend:

```bash
cd frontend
npm run build
```

Vite will automatically use the environment variables from your `.env` file.

### 5. Platform-Specific Setup

#### Vercel
Add environment variables in Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL = https://your-backend.railway.app/api
VITE_SERVER_URL = https://your-backend.railway.app
VITE_ENV = production
```

#### Netlify
Add in Dashboard → Site Settings → Environment Variables

#### Docker
Pass as build args in `Dockerfile`:
```dockerfile
ARG VITE_API_BASE_URL
ARG VITE_SERVER_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL
```

### 6. Common Issues

**Problem:** Files not downloading in production
- **Check:** `VITE_SERVER_URL` matches your backend domain
- **Fix:** Ensure no trailing slash: ✅ `https://api.com` ❌ `https://api.com/`

**Problem:** API calls failing
- **Check:** `VITE_API_BASE_URL` includes `/api` at the end
- **Fix:** Correct format: `https://your-domain.com/api`

**Problem:** CORS errors
- **Fix:** Update backend CORS to allow your frontend domain

### 7. Testing Production Build Locally

```bash
# Build with production env
cd frontend
npm run build

# Preview the production build
npm run preview

# Should open on http://localhost:4173
# Test if file downloads work correctly
```

### 8. Environment-Specific Files

You can create multiple env files:
- `.env` - Default for all environments
- `.env.development` - Only for development
- `.env.production` - Only for production
- `.env.local` - Local overrides (gitignored)

Priority: `.env.local` > `.env.[mode]` > `.env`

### 9. Checking Current Config

Add this to see what URLs are being used:

```typescript
console.log('API Base:', import.meta.env.VITE_API_BASE_URL)
console.log('Server:', import.meta.env.VITE_SERVER_URL)
```

### 10. Security Note

⚠️ **Never commit `.env` files with real credentials to Git!**

`.env` is gitignored by default. Use `.env.example` for documentation.

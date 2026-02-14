# Deployment Guide

This guide explains how to deploy your school management system to a production environment.

## Environment Configuration

The application uses environment variables to configure URLs for different environments (development vs production).

### Frontend Configuration

#### Development (Local)
The default `.env` file is already configured for local development:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SERVER_URL=http://localhost:4000
VITE_ENV=development
```

#### Production
When deploying to production, create a `.env.production` file or update `.env` with your production URLs:

```env
# Replace with your actual domain
VITE_API_BASE_URL=https://your-domain.com/api
VITE_SERVER_URL=https://your-domain.com
VITE_ENV=production
```

### Backend Configuration

Create a `.env` file in the `backend` folder:

```env
# Database
DATABASE_URL=your_production_database_url

# Server
PORT=4000
NODE_ENV=production

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Supabase (if using)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel:
1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`
   - `VITE_SERVER_URL` = `https://your-backend-domain.com`
   - `VITE_ENV` = `production`
4. Deploy

#### Backend on Railway/Render:
1. Import your backend folder to Railway/Render
2. Set environment variables
3. Deploy
4. Copy the deployed URL to use in frontend env variables

### Option 2: Full Stack on Same Server (VPS)

#### Using PM2 and Nginx:

1. **Backend Setup:**
```bash
cd backend
npm install
pm2 start app.js --name school-backend
```

2. **Frontend Build:**
```bash
cd frontend
npm run build
```

3. **Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files (uploads)
    location /uploads {
        proxy_pass http://localhost:4000;
    }
}
```

### Option 3: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:4000/api
      - VITE_SERVER_URL=http://backend:4000
    depends_on:
      - backend

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=school
      - POSTGRES_PASSWORD=secure_password
      - POSTGRES_DB=school_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Important Notes

### File Uploads
Make sure your production server can handle file uploads:
- Backend `uploads/` folder should be writable
- Consider using cloud storage (AWS S3, Cloudinary, Supabase Storage) for production
- Update file upload paths in backend if using cloud storage

### CORS Configuration
Update backend CORS settings for production domain:

```javascript
// backend/app.js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
```

### Database
- Use PostgreSQL for production (not SQLite)
- Run migrations before deployment
- Backup database regularly

### Security Checklist
- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set secure CORS origins
- [ ] Sanitize all user inputs
- [ ] Rate limit API endpoints
- [ ] Use environment variables for all secrets
- [ ] Enable SQL injection protection
- [ ] Regular security updates

## Testing Before Production

1. **Build frontend locally:**
```bash
cd frontend
npm run build
npm run preview
```

2. **Test backend:**
```bash
cd backend
NODE_ENV=production node app.js
```

3. **Check all features:**
- [ ] Login/Authentication
- [ ] File uploads
- [ ] Announcements with attachments
- [ ] Image display
- [ ] API calls
- [ ] Student/Staff management

## Monitoring

Consider setting up:
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Uptime monitoring (UptimeRobot)
- Log aggregation (Logtail, Papertrail)

## Support

For issues:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables are set correctly
4. Test API endpoints with Postman/Thunder Client

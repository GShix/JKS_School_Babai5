# School Profile & Messages Management System

## Overview

This implementation provides a complete system for dynamically managing school information and messages (like Principal's message) from the admin dashboard.

## Features

### 1. **School Profile Management**
- Manage basic school information (name, contact details, address)
- Multi-language support (English & Nepali)
- School introduction text for homepage
- Website and social media links
- All content is editable from Admin Dashboard

### 2. **Messages Management**
- Add messages from Principal or other valuable persons
- Photo upload for each person
- Rich text messages
- Display order control
- Active/Inactive status toggle
- Perfect for "Message from Principal", "Chairman's Message", etc.

### 3. **Dynamic Frontend**
- Header automatically fetches school contact details
- Homepage displays school introduction from database
- Announcements section shows latest announcements
- All content updates in real-time when changed from admin panel

---

## Database Setup

### Step 1: Run the SQL Migration

Execute the SQL file to create the necessary tables:

```bash
# Using MySQL command line
mysql -u your_username -p your_database_name < backend/database/migrations/create_school_profile_tables.sql

# Or using phpMyAdmin
# Simply copy and paste the SQL from create_school_profile_tables.sql file
```

### Step 2: Verify Tables Created

The migration creates two tables:
1. `school_profile` - Stores school information
2. `school_messages` - Stores messages from valuable persons

---

## Backend Structure

### Controllers
- `backend/controllers/schoolProfileController.js` - Handles school profile CRUD
- `backend/controllers/messageController.js` - Handles messages CRUD

### Routes
- `GET /api/school-profile` - Get school profile (Public)
- `PUT /api/school-profile` - Update school profile (Admin only)
- `GET /api/messages` - Get all messages (Public, supports ?active=true filter)
- `GET /api/messages/:id` - Get single message
- `POST /api/messages` - Create message (Admin only, supports file upload)
- `PUT /api/messages/:id` - Update message (Admin only, supports file upload)
- `DELETE /api/messages/:id` - Delete message (Admin only)

### Middlewares
- `backend/middlewares/messageUploadMiddleware.js` - Handles photo uploads for messages

---

## Frontend Structure

### API Services
- `frontend/src/api/services/schoolProfileService.ts` - School profile API calls
- `frontend/src/api/services/messageService.ts` - Messages API calls

### Admin Components
- `frontend/src/components/admin/MessageManagement.tsx` - Manage messages
- Note: SchoolProfileManagement.tsx already exists

### Public Components (Updated)
- `frontend/src/layouts/Header.tsx` - Fetches and displays school contact info
- `frontend/src/components/SchoolIntroduction_Announcements.tsx` - Fetches and displays school intro

---

## How to Add to Admin Dashboard

### Add Routes to Admin Router

**File:** `frontend/src/routes.tsx` (or wherever your routes are defined)

```tsx
import MessageManagement from './components/admin/MessageManagement';

// Add these routes in your admin routes section:
{
  path: '/admin/school-profile',
  element: <SchoolProfileManagement />
},
{
  path: '/admin/messages',
  element: <MessageManagement />
}
```

### Add Menu Items to Admin Sidebar

**File:** `frontend/src/components/admin/AdminSidebar.tsx` (or your sidebar component)

```tsx
// Add these menu items:
{
  title: 'School Profile',
  icon: <Building className="w-5 h-5" />,
  path: '/admin/school-profile'
},
{
  title: 'Messages',
  icon: <MessageSquare className="w-5 h-5" />,
  path: '/admin/messages'
}
```

---

## Usage Guide

### For Administrators

#### **Managing School Profile**
1. Go to Admin Dashboard → School Profile
2. Fill in all school information
3. Add school introduction text (shows on homepage)
4. Add contact details (shows in header)
5. Click "Save School Profile"

#### **Managing Messages**
1. Go to Admin Dashboard → Messages
2. Click "Add New Message"
3. Fill in:
   - Person Name (e.g., "Mr. Ram Sharma")
   - Position (e.g., "Principal")
   - Message (the actual message text)
   - Upload Photo (optional, max 5MB)
   - Display Order (lower numbers appear first)
   - Active status (toggle visibility)
4. Click "Add Message"

**To Edit:**
- Click the edit icon next to any message
- Make changes
- Click "Update Message"

**To Toggle Visibility:**
- Click the eye icon to activate/deactivate without deleting

**To Delete:**
- Click the trash icon
- Confirm deletion

### For End Users (Website Visitors)

- School contact information in header updates automatically
- School introduction on homepage reflects admin changes
- Recent announcements show latest 3 announcements
- All content is real-time from database

---

## Data Schema

### School Profile
```typescript
{
  schoolName: string;          // "JKSS School"
  schoolNameNepali: string;    // "श्री जनकल्याण माध्यमिक विद्यालय"
  phone: string;               // "+977 9844929502"
  email: string;               // "jksschoolp5@gmail.com"
  address: string;             // "Padampur, Dang"
  addressNepali: string;       // "बबई-५, पदमपुर, दाङ"
  province: string;            // "Lumbini"
  district: string;            // "Dang"
  municipality: string;        // "Ghorahi"
  ward: string;                // "5"
  introduction: string;        // Long text for homepage
  establishedYear: string;     // "2005"
  principalName: string;       // "Mr. Principal Name"
  website: string;             // URL
  facebookUrl: string;         // Facebook page URL
}
```

### School Message
```typescript
{
  personName: string;          // "Mr. Ram Sharma"
  personPosition: string;      // "Principal"
  message: string;             // The actual message
  photo: string;               // Photo URL
  displayOrder: number;        // 0, 1, 2, ... (display order)
  isActive: boolean;           // true/false (visibility)
}
```

---

## File Upload Configuration

### Message Photos
- **Location:** `backend/uploads/messages/`
- **Max Size:** 5MB
- **Allowed Types:** JPEG, JPG, PNG, GIF
- **Naming:** `message-{timestamp}-{random}.ext`

---

## API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/school-profile` | Public | Get school profile |
| PUT | `/api/school-profile` | Admin | Update school profile |
| GET | `/api/messages` | Public | Get all messages |
| GET | `/api/messages?active=true` | Public | Get active messages only |
| GET | `/api/messages/:id` | Public | Get single message |
| POST | `/api/messages` | Admin | Create message |
| PUT | `/api/messages/:id` | Admin | Update message |
| DELETE | `/api/messages/:id` | Admin | Delete message |

---

## Testing the Implementation

1. **Test School Profile:**
   ```bash
   # Get school profile
   GET http://localhost:4000/api/school-profile
   
   # Update school profile (requires admin auth)
   PUT http://localhost:4000/api/school-profile
   Body: { schoolName: "Test School", phone: "123456", ... }
   ```

2. **Test Messages:**
   ```bash
   # Get all messages
   GET http://localhost:4000/api/messages
   
   # Get active messages only
   GET http://localhost:4000/api/messages?active=true
   
   # Create message (requires admin auth + FormData for photo)
   POST http://localhost:4000/api/messages
   ```

---

## Troubleshooting

### Issue: "School profile not found"
- **Solution:** Run the SQL migration to create tables and insert default data

### Issue: Photo upload fails
- **Solution:** 
  - Check `backend/uploads/messages/` directory exists and has write permissions
  - Verify file size is under 5MB
  - Ensure file is an image type

### Issue: School info not showing on frontend
- **Solution:**
  - Check browser console for API errors
  - Verify backend is running on port 4000
  - Clear browser cache

---

## Future Enhancements

- [ ] Add rich text editor for messages
- [ ] Support for multiple images per message
- [ ] Message categories (Principal, Chairman, etc.)
- [ ] Archive functionality for old messages
- [ ] Email notifications when messages are updated

---

## Support

For issues or questions, please refer to:
- Backend API Documentation: `backend/API_DOCUMENTATION.md`
- Frontend Components: Check component files for inline documentation
- Database Schema: `backend/database/migrations/create_school_profile_tables.sql`

---

## License

This implementation is part of the JKSS School Management System.

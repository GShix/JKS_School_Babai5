# Content Management System - Implementation Guide

## Overview
A comprehensive content management system has been created to handle all dynamic page content in the school management system, including Nepali language support.

## Backend Implementation

### 1. Database Model
**File:** `backend/database/models/contentModel.js`

**Schema Fields:**
- `section`: Content section identifier (school_profile, hero, downloads, gallery, career)
- `key`: Content key within the section
- `value`: Content value (text, JSON, or URL)
- `valueType`: Type of value (text, json, url, number, boolean)
- `metadata`: Additional metadata as JSON
- `category`: Optional category for filtering
- `language`: Language code (en, ne for Nepali)
- `status`: active, inactive, or draft
- `order`: Display order

### 2. Controller
**File:** `backend/controllers/contentController.js`

**Endpoints:**
- `getContentBySection` - Get all content for a specific section
- `getSchoolProfile` - Get school profile data
- `updateSchoolProfile` - Update school profile
- `getAllContent` - Get all content (admin only)
- `createContent` - Create new content item
- `updateContent` - Update content item
- `deleteContent` - Delete content item
- `bulkUpdateContent` - Bulk update multiple items
- `initializeDefaultContent` - Initialize with default data

### 3. Routes
**File:** `backend/routes/contentRoute.js`

**Public Routes:**
- `GET /api/content/section/:section` - Fetch content by section
- `GET /api/content/school-profile` - Get school profile

**Admin Routes (Authentication Required):**
- `GET /api/content` - List all content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `PUT /api/content/school-profile` - Update school profile
- `POST /api/content/bulk-update` - Bulk update
- `POST /api/content/initialize` - Initialize default content

## Frontend Implementation

### 1. School Profile Management
**File:** `frontend/src/components/admin/SchoolProfileManagement.tsx`

**Features:**
- Nepali school name fields (श्री जनकल्याण, माध्यमिक विद्यालय:)
- English school information
- Principal message and photo
- Vision & Mission
- About Us page content
- Contact information
- Google Maps integration

### 2. About Page
**File:** `frontend/src/pages/about/About.tsx`

**Now Dynamically Renders:**
- Nepali school name in hero section
- School story from database
- School description from database
- Contact address from database
- Google Maps embed from database

## Setup Instructions

### Step 1: Start Backend Server
```bash
cd backend
node app.js
```

### Step 2: Initialize Database Content
Run the seeder to populate initial content:
```bash
cd backend
node seedContent.js
```

This will create:
- ✓ Nepali school names (श्री जनकल्याण, माध्यमिक विद्यालय:)
- ✓ English school information
- ✓ Principal details
- ✓ Vision & Mission
- ✓ About page content
- ✓ Contact information
- ✓ Hero section content

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

## Usage

### For Administrators:

1. **Login to Admin Panel**
   - Navigate to `/admin/login`
   - Use admin credentials

2. **Access School Profile Management**
   - Click "School Profile" in sidebar
   - Edit content in 4 tabs:
     - Basic Information (includes Nepali names)
     - About Us Page
     - Principal Message
     - Vision & Mission

3. **Save Changes**
   - Click "Save Changes" button
   - Content updates directly in database
   - Frontend pages automatically reflect changes

### For Frontend Pages:

The following pages now fetch content from database:
- **About Page** (`/about/jkss`) - Shows Nepali school name, story, description, map
- **Home Page** (ready for hero/banner integration)
- **School Profile** (ready for detailed information)

## Nepali Language Support

### School Names Included:
- श्री जनकल्याण (Shri Janakalyan)
- माध्यमिक विद्यालय: (Secondary School)

### Database Structure:
Content is stored with `language` field:
- `en` - English content
- `ne` - Nepali content

### Example Usage:
```javascript
// Fetch English content
GET /api/content/school-profile?language=en

// Fetch Nepali content
GET /api/content/school-profile?language=ne
```

## Content Sections

### 1. school_profile
- School names (English & Nepali)
- Contact information
- Principal details
- Vision & Mission
- Facilities & Achievements
- About page content

### 2. hero
- Homepage hero section
- Title, subtitle, background image
- CTA text and link

### 3. downloads (Ready for implementation)
- Study materials
- Notes and question papers

### 4. gallery (Ready for implementation)
- School photos
- Event images

### 5. career (Ready for implementation)
- Job postings
- Vacancy information

## API Examples

### Get School Profile
```javascript
GET http://localhost:4000/api/content/school-profile
Response:
{
  "success": true,
  "data": {
    "schoolName": "Janakalyan Higher Secondary School",
    "schoolNameNepali": "श्री जनकल्याण",
    "schoolTypeNepali": "माध्यमिक विद्यालय:",
    "address": "Babai Rural Municipality-5, Padampur, Dang",
    ...
  }
}
```

### Update School Profile
```javascript
PUT http://localhost:4000/api/content/school-profile
Headers: { Authorization: "Bearer <admin_token>" }
Body: {
  "schoolName": "New School Name",
  "schoolNameNepali": "नयाँ स्कूल नाम",
  "mission": "Updated mission..."
}
```

## Benefits

1. **Centralized Content Management**
   - All page content in one database table
   - Easy to update and maintain

2. **Multi-language Support**
   - Nepali and English content separation
   - Easy to add more languages

3. **No Code Changes Needed**
   - Admins update content through UI
   - Frontend automatically reflects changes

4. **Version Control Ready**
   - Content changes tracked in database
   - Easy to revert if needed

5. **SEO Friendly**
   - Dynamic meta content
   - Search engine friendly URLs

## Next Steps

1. ✅ Database model created
2. ✅ Backend API endpoints ready
3. ✅ Admin panel for school profile
4. ✅ About page integrated
5. ⏳ Hero section integration
6. ⏳ Downloads section integration
7. ⏳ Gallery section integration
8. ⏳ Career section integration

## Troubleshooting

### Content not showing?
1. Check if backend is running (port 4000)
2. Run seeder: `node backend/seedContent.js`
3. Check browser console for errors

### Can't update content?
1. Verify admin authentication
2. Check token in localStorage/sessionStorage
3. Verify admin role in database

### Nepali text not displaying?
1. Check database encoding (UTF-8)
2. Verify content was seeded properly
3. Check browser font support for Devanagari script

# 🎯 RESTful API Architecture - Quick Start

## ✅ What's Been Implemented

A complete, production-ready RESTful API layer for the frontend:

### 📁 New File Structure
```
frontend/src/
├── api/
│   ├── client.ts              # Axios client with interceptors
│   ├── config.ts              # Endpoints & configuration
│   ├── types.ts               # TypeScript types
│   ├── index.ts               # Main exports
│   └── services/
│       ├── authService.ts     # 🔐 Authentication
│       ├── staffService.ts    # 👥 Staff management
│       ├── studentService.ts  # 🎓 Student management
│       ├── blogService.ts     # 📝 Blog management
│       └── index.ts
├── utils/
│   └── errorHandler.ts        # 🚨 Error handling utilities
└── .env.example               # Environment template
```

### 🚀 Key Features

✅ **Centralized API Client**
- Automatic token attachment to all requests
- Global request/response interceptors
- Development logging
- Network error handling

✅ **Type-Safe Services**
- TypeScript interfaces for all data models
- Autocomplete for all API methods
- Compile-time error checking

✅ **Automatic Authentication**
- Login once, token attached to all requests
- Auto-logout on 401 errors
- RememberMe support (localStorage vs sessionStorage)

✅ **Smart Error Handling**
- User-friendly error messages
- Validation error parsing
- Network error detection
- Auth error detection

✅ **File Upload Support**
- FormData handling for images
- Automatic Content-Type headers
- Progress tracking ready

## 🎯 Quick Usage

### 1. Setup Environment

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 2. Use in Components

```tsx
import { staffService, Staff } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

// Fetch data
const response = await staffService.getAll();
setStaff(response.data || []);

// Create with image
const formData = new FormData();
formData.append('fullName', 'John Doe');
formData.append('profileImage', imageFile);
await staffService.create(formData);

// Update
await staffService.update(id, updateData);

// Delete
await staffService.delete(id);

// Error handling
try {
  await staffService.create(data);
} catch (error) {
  alert(getErrorMessage(error));
}
```

### 3. Login

```tsx
import { authService } from '../../api';

await authService.adminLogin({
  email: 'admin@school.com',
  password: 'password',
  rememberMe: true
});

// All future API calls automatically authenticated!
```

## 📊 Available Services

| Service | Methods | Description |
|---------|---------|-------------|
| `authService` | login, logout, isAuthenticated | Authentication |
| `staffService` | getAll, getById, create, update, delete | Staff management |
| `studentService` | getAll, getById, create, update, delete | Student management |
| `blogService` | getAll, getById, create, update, delete | Blog management |

## 🔄 Migration Status

### ✅ Completed
- [x] API infrastructure
- [x] Type definitions
- [x] Services (auth, staff, student, blog)
- [x] Error handling utilities
- [x] StaffManagement component
- [x] OurTeam page

### 📝 To Migrate
- [ ] Other admin components
- [ ] Other pages with API calls
- [ ] Login/Register pages

## 📚 Documentation

- **[RESTFUL_API_GUIDE.md](RESTFUL_API_GUIDE.md)** - Complete guide with examples
- **[API_MIGRATION_EXAMPLES.md](API_MIGRATION_EXAMPLES.md)** - Before/After examples

## 🎨 Example: Complete Component

```tsx
import React, { useEffect, useState } from 'react';
import { staffService, Staff } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      setStaff(response.data || []);
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete?')) return;
    
    try {
      await staffService.delete(id);
      alert('Deleted successfully!');
      fetchStaff();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {staff.map(member => (
        <div key={member.id}>
          <h3>{member.fullName}</h3>
          <p>{member.position}</p>
          <button onClick={() => handleDelete(member.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default StaffList;
```

## 🚨 Common Patterns

### Loading State
```tsx
const [loading, setLoading] = useState(false);

try {
  setLoading(true);
  await staffService.create(data);
} finally {
  setLoading(false);
}
```

### Error Display
```tsx
try {
  await staffService.create(data);
  alert('Success!');
} catch (error) {
  alert(`Error: ${getErrorMessage(error)}`);
}
```

### File Upload
```tsx
const formData = new FormData();
formData.append('fullName', 'John');
formData.append('profileImage', imageFile);

await staffService.create(formData);
// Content-Type automatically set to multipart/form-data
```

### Check Network Error
```tsx
import { isNetworkError } from '../../utils/errorHandler';

try {
  await staffService.getAll();
} catch (error) {
  if (isNetworkError(error)) {
    alert('Check your internet connection');
  } else {
    alert(getErrorMessage(error));
  }
}
```

## 💡 Benefits

| Before | After |
|--------|-------|
| Hardcoded URLs everywhere | Centralized configuration |
| Manual token handling | Automatic token injection |
| Inconsistent error handling | Standardized error messages |
| Duplicate type definitions | Shared TypeScript types |
| No request logging | Automatic dev logging |
| Complex file uploads | Simple FormData handling |

## 🔧 Environment Variables

```env
# Development
VITE_API_BASE_URL=http://localhost:4000/api

# Production
VITE_API_BASE_URL=https://api.yourschool.com/api
```

## ⚡ Performance Features

- Request/response interceptors
- Automatic token refresh ready
- Request cancellation support
- Caching ready (add React Query later)

## 🛡️ Security Features

- CORS handling
- XSS protection via Content-Type headers
- Automatic logout on token expiration
- Secure token storage (httpOnly ready)

## 🎓 Next Steps

1. **Complete Migration**: Update remaining components
2. **Add Notifications**: Integrate react-hot-toast
3. **Add Loading UI**: Global loading indicator
4. **Add Caching**: Implement React Query
5. **Add Pagination**: Extend services for pagination
6. **Add Filtering**: Extend services for advanced filters

## 📖 Learn More

- Check [RESTFUL_API_GUIDE.md](RESTFUL_API_GUIDE.md) for detailed examples
- See [API_MIGRATION_EXAMPLES.md](API_MIGRATION_EXAMPLES.md) for migration patterns
- Review [api/types.ts](frontend/src/api/types.ts) for all available types

---

**Ready to use!** Start migrating your components to use the new service layer. 🚀

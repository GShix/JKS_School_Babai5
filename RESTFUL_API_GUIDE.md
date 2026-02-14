# RESTful API Architecture - Complete Guide

## 🎯 Overview

This project now uses a modern, RESTful API architecture with:

- ✅ **Centralized API Client** with Axios interceptors
- ✅ **Type-Safe Services** for all resources
- ✅ **Automatic Authentication** via interceptors
- ✅ **Consistent Error Handling**
- ✅ **Environment Configuration**
- ✅ **Request/Response Logging** (development mode)

## 📁 Project Structure

```
frontend/src/
├── api/
│   ├── client.ts              # Axios instance with interceptors
│   ├── config.ts              # API endpoints and configuration
│   ├── types.ts               # TypeScript type definitions
│   ├── index.ts               # Main export file
│   └── services/
│       ├── index.ts           # Services export
│       ├── authService.ts     # Authentication service
│       ├── staffService.ts    # Staff management service
│       ├── studentService.ts  # Student management service
│       └── blogService.ts     # Blog management service
├── utils/
│   └── errorHandler.ts        # Error handling utilities
```

## 🚀 Quick Start

### 1. Environment Setup

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ENV=development
```

### 2. Import and Use Services

```tsx
import { staffService, Staff } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';
```

### 3. Make API Calls

```tsx
const fetchStaff = async () => {
  try {
    const response = await staffService.getAll();
    setStaff(response.data || []);
  } catch (error) {
    console.error('Error:', getErrorMessage(error));
  }
};
```

## 📚 Service API Reference

### Staff Service

```typescript
import { staffService } from '../../api';

// Get all staff
const response = await staffService.getAll();

// Get staff by ID
const staff = await staffService.getById(1);

// Get by department
const scienceStaff = await staffService.getByDepartment('Science');

// Get by status
const activeStaff = await staffService.getByStatus('active');

// Create staff (with image)
const formData = new FormData();
formData.append('fullName', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('profileImage', imageFile);
await staffService.create(formData);

// Update staff
await staffService.update(staffId, formData);

// Delete staff
await staffService.delete(staffId);
```

### Student Service

```typescript
import { studentService } from '../../api';

// Get all students
const response = await studentService.getAll();

// Get student by ID
const student = await studentService.getById(1);

// Get by class
const class10Students = await studentService.getByClass('Class 10');

// Create student
await studentService.create(studentData);

// Update student
await studentService.update(studentId, updateData);

// Delete student
await studentService.delete(studentId);
```

### Authentication Service

```typescript
import { authService } from '../../api';

// Admin login
const loginData = {
  email: 'admin@school.com',
  password: 'password123',
  rememberMe: true
};
const response = await authService.adminLogin(loginData);
// Token is automatically stored

// Student login
await authService.studentLogin(loginData);

// Logout
authService.logout();

// Check authentication
if (authService.isAuthenticated()) {
  // User is logged in
}

// Get token
const token = authService.getToken();
```

### Blog Service

```typescript
import { blogService } from '../../api';

// Get all blogs
const response = await blogService.getAll();

// Get blog by ID
const blog = await blogService.getById(blogId);

// Create blog
await blogService.create(blogData);

// Update blog
await blogService.update(blogId, updateData);

// Delete blog
await blogService.delete(blogId);
```

## 🔧 Advanced Usage

### Custom API Calls

If you need to make a custom API call not covered by services:

```typescript
import { api } from '../../api';

// GET request
const response = await api.get('/custom-endpoint');

// POST request
await api.post('/custom-endpoint', { data: 'value' });

// PUT request
await api.put('/custom-endpoint/1', { data: 'updated' });

// DELETE request
await api.delete('/custom-endpoint/1');

// Upload file
const formData = new FormData();
formData.append('file', file);
await api.upload('/upload-endpoint', formData);
```

### Error Handling

```typescript
import { getErrorMessage, isNetworkError, isAuthError } from '../../utils/errorHandler';

try {
  await staffService.create(data);
} catch (error) {
  // Get user-friendly error message
  const message = getErrorMessage(error);
  
  // Check error type
  if (isNetworkError(error)) {
    alert('No internet connection');
  } else if (isAuthError(error)) {
    alert('Please login again');
  } else {
    alert(message);
  }
}
```

### Validation Errors

```typescript
import { getValidationErrors, formatFieldError } from '../../utils/errorHandler';

try {
  await staffService.create(data);
} catch (error) {
  // Get all validation errors
  const validationErrors = getValidationErrors(error);
  if (validationErrors) {
    // { email: ['Email is required'], phone: ['Invalid phone number'] }
    console.log(validationErrors);
  }
  
  // Get error for specific field
  const emailError = formatFieldError(error, 'email');
  // 'Email is required'
}
```

## 🎨 Complete Example: Staff Management

```tsx
import React, { useEffect, useState } from 'react';
import { staffService, Staff } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: '',
    // ... other fields
  });

  // Fetch staff on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      setStaff(response.data || []);
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      await staffService.create(submitData);
      
      alert('Staff created successfully!');
      fetchStaff(); // Refresh list
      resetForm();
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await staffService.delete(id);
      alert('Deleted successfully!');
      fetchStaff();
    } catch (error) {
      alert(`Error: ${getErrorMessage(error)}`);
    }
  };

  return (
    <div>
      {/* Your UI components */}
    </div>
  );
};

export default StaffManagement;
```

## 🔒 Authentication Flow

The API client automatically handles authentication:

1. **Login**: Call `authService.adminLogin()` or `authService.studentLogin()`
2. **Token Storage**: Token is automatically stored in localStorage/sessionStorage
3. **Auto-Attach**: All subsequent API requests automatically include the token
4. **Auto-Logout**: If token expires (401), user is redirected to login

```typescript
// Login
const handleLogin = async () => {
  try {
    await authService.adminLogin({
      email: 'admin@school.com',
      password: 'password',
      rememberMe: true
    });
    
    // Token is now stored and will be used for all requests
    navigate('/dashboard');
  } catch (error) {
    alert(getErrorMessage(error));
  }
};

// All API calls now automatically include token
await staffService.getAll(); // Authorization header added automatically
```

## 🌐 API Response Format

All API responses follow this structure:

```typescript
// Success Response
{
  message: "Staff fetched successfully",
  data: [
    { id: 1, fullName: "John Doe", ... },
    { id: 2, fullName: "Jane Smith", ... }
  ]
}

// Error Response
{
  message: "Validation failed",
  error: "VALIDATION_ERROR",
  errors: {
    email: ["Email is required", "Email must be valid"],
    phone: ["Phone is required"]
  }
}
```

## 🚨 Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check validation errors |
| 401 | Unauthorized | User logged out, redirect to login |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Contact support |
| 0 | Network Error | Check internet connection |

## 📝 TypeScript Benefits

Full type safety for all API calls:

```typescript
// TypeScript knows the exact structure
const response = await staffService.getAll();
// response.data is Staff[]

const staff = response.data[0];
// TypeScript autocomplete: staff.fullName, staff.email, etc.

// Type checking prevents errors
await staffService.create({
  fullName: 'John Doe',
  emial: 'john@example.com' // ❌ TypeScript error: 'emial' doesn't exist
});
```

## 🔄 Migration Guide

### Before (Direct Axios):
```tsx
const fetchStaff = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:4000/api/staff', {
    headers: { Authorization: `Bearer ${token}` }
  });
  setStaff(response.data.data);
};
```

### After (Service Layer):
```tsx
const fetchStaff = async () => {
  const response = await staffService.getAll();
  setStaff(response.data || []);
};
```

**Benefits:**
- ✅ No hardcoded URLs
- ✅ No manual token handling
- ✅ Consistent error handling
- ✅ Type safety
- ✅ Cleaner code

## 🎯 Best Practices

1. **Always use services** instead of direct axios calls
2. **Handle errors** with try/catch and `getErrorMessage()`
3. **Use TypeScript types** from `api/types.ts`
4. **Set loading states** during async operations
5. **Use FormData** for file uploads
6. **Check authentication** with `authService.isAuthenticated()`
7. **Configure environment** via `.env` file

## 📚 Next Steps

1. ✅ Update all components to use service layer
2. ✅ Add toast notifications (react-hot-toast)
3. ✅ Implement request caching
4. ✅ Add pagination support
5. ✅ Create more specialized services as needed

## 🆘 Troubleshooting

### API calls not working
- Check `VITE_API_BASE_URL` in `.env`
- Verify backend is running on correct port
- Check browser console for errors

### Token not being sent
- Ensure login was successful
- Check if token is stored: `authService.getToken()`
- Verify interceptor is configured correctly

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check import paths are correct
- Verify types match API response structure

## 🎓 Resources

- [Axios Documentation](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Query](https://tanstack.com/query) - For advanced data fetching (future)

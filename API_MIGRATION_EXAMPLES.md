# API Migration Examples

## Quick Reference: Before & After

### Example 1: Fetching Data

#### ❌ Before (Direct Axios)
```tsx
import axios from 'axios';

const fetchStaff = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/api/staff', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStaff(response.data.data || []);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to fetch staff');
  }
};
```

#### ✅ After (Service Layer)
```tsx
import { staffService } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

const fetchStaff = async () => {
  try {
    const response = await staffService.getAll();
    setStaff(response.data || []);
  } catch (error) {
    console.error('Error:', getErrorMessage(error));
    alert(`Failed to fetch staff: ${getErrorMessage(error)}`);
  }
};
```

---

### Example 2: Creating with File Upload

#### ❌ Before
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    if (image) formData.append('profileImage', image);
    
    await axios.post('http://localhost:4000/api/staff/create', formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    alert('Success!');
    fetchStaff();
  } catch (error) {
    alert('Failed to create staff');
  }
};
```

#### ✅ After
```tsx
import { staffService } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    if (image) formData.append('profileImage', image);
    
    await staffService.create(formData);
    
    alert('Staff created successfully!');
    fetchStaff();
  } catch (error) {
    alert(`Failed to create staff: ${getErrorMessage(error)}`);
  }
};
```

---

### Example 3: Updating

#### ❌ Before
```tsx
const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    await axios.put(
      `http://localhost:4000/api/staff/${id}/update`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Updated!');
  } catch (error) {
    alert('Update failed');
  }
};
```

#### ✅ After
```tsx
const handleUpdate = async () => {
  try {
    await staffService.update(id, updateData);
    alert('Staff updated successfully!');
  } catch (error) {
    alert(`Update failed: ${getErrorMessage(error)}`);
  }
};
```

---

### Example 4: Deleting

#### ❌ Before
```tsx
const handleDelete = async (id: number) => {
  if (!confirm('Delete?')) return;
  
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    await axios.delete(`http://localhost:4000/api/staff/${id}/delete`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchStaff();
  } catch (error) {
    alert('Delete failed');
  }
};
```

#### ✅ After
```tsx
const handleDelete = async (id: number) => {
  if (!confirm('Delete this staff member?')) return;
  
  try {
    await staffService.delete(id);
    alert('Staff deleted successfully!');
    fetchStaff();
  } catch (error) {
    alert(`Delete failed: ${getErrorMessage(error)}`);
  }
};
```

---

### Example 5: Login

#### ❌ Before
```tsx
const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:4000/api/admin/login', {
      email,
      password
    });
    
    const token = response.data.token;
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    
    navigate('/dashboard');
  } catch (error) {
    alert('Login failed');
  }
};
```

#### ✅ After
```tsx
import { authService } from '../../api';

const handleLogin = async () => {
  try {
    await authService.adminLogin({
      email,
      password,
      rememberMe
    });
    
    navigate('/dashboard');
  } catch (error) {
    alert(`Login failed: ${getErrorMessage(error)}`);
  }
};
```

---

### Example 6: Component with Types

#### ❌ Before
```tsx
import axios from 'axios';

interface Student {
  id: number;
  fullName: string;
  email: string;
  // ... duplicate type definitions everywhere
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  
  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/api/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStudents(response.data.data);
  };
  
  // ...
};
```

#### ✅ After
```tsx
import { studentService, Student } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  
  const fetchStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data || []);
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };
  
  // ...
};
```

---

### Example 7: Filtering Data

#### ❌ Before
```tsx
const fetchActiveStaff = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:4000/api/staff', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const active = response.data.data.filter((s: any) => s.status === 'active');
  setStaff(active);
};
```

#### ✅ After
```tsx
const fetchActiveStaff = async () => {
  try {
    const response = await staffService.getByStatus('active');
    setStaff(response.data || []);
  } catch (error) {
    console.error(getErrorMessage(error));
  }
};
```

---

## Component Update Checklist

When updating a component:

1. ✅ **Remove** axios import
2. ✅ **Add** service import: `import { staffService } from '../../api'`
3. ✅ **Add** error handler: `import { getErrorMessage } from '../../utils/errorHandler'`
4. ✅ **Remove** interface definitions (use types from API)
5. ✅ **Remove** token retrieval code
6. ✅ **Remove** hardcoded URLs
7. ✅ **Replace** axios calls with service methods
8. ✅ **Update** error messages to use `getErrorMessage()`
9. ✅ **Test** the component

## Files to Update

Based on grep search, these files contain axios calls:

### Components
- [x] ✅ `components/admin/StaffManagement.tsx` - DONE
- [ ] `components/admin/AdminsManagement.tsx`
- [ ] `components/admin/BlogsManagement.tsx`
- [ ] `components/admin/AnnouncementsManagement.tsx`
- [ ] `components/admin/StudentManagement.tsx`

### Pages
- [x] ✅ `pages/ourTeam/OurTeam.tsx` - DONE
- [ ] `pages/admin/AdminDashboard.tsx`
- [ ] `pages/blogs/AllBlogs.tsx`
- [ ] `pages/blogs/SingleBlog.tsx`
- [ ] `pages/blogs/EditBlog.tsx`
- [ ] `pages/blogs/CreateBlog.tsx`
- [ ] `pages/auth/Login.tsx`
- [ ] `pages/auth/StudentLogin.tsx`
- [ ] `pages/about/About.tsx`

## Quick Win: Replace All Axios Imports

Find: `import axios from 'axios';`

Replace with:
```tsx
import { staffService, Student } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';
```

(Adjust the service based on what the component uses)

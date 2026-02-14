# JKSS School Management System - Complete API Documentation

## Overview
Modern, full-featured school management system with separate authentication for admins and students.

## System Architecture

### User Types
1. **Super Admin** - Full system access, can manage admins
2. **Admin** - Manage students, staff, and school operations
3. **Student** - Access their own data, submit assignments, view grades

---

## 🔐 AUTHENTICATION ENDPOINTS

### Admin Authentication

#### POST `/api/admin/login`
**Public** - Admin login
```json
Request:
{
  "email": "superadmin@jkss.com",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "data": {
    "id": 1,
    "fullName": "Super Admin",
    "email": "superadmin@jkss.com",
    "role": "superAdmin",
    "status": "active"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/admin/register`
**Protected** - SuperAdmin only - Create new admin
```json
Request:
{
  "fullName": "John Doe",
  "email": "john@jkss.com",
  "password": "password123",
  "role": "admin",
  "phone": "1234567890"
}
```

#### GET `/api/admin/profile`
**Protected** - Get current admin profile

#### PUT `/api/admin/profile`
**Protected** - Update admin profile

#### PUT `/api/admin/change-password`
**Protected** - Change admin password

#### GET `/api/admin/all`
**Protected** - SuperAdmin only - Get all admins

#### PUT `/api/admin/:id/status`
**Protected** - SuperAdmin only - Update admin status

#### DELETE `/api/admin/:id`
**Protected** - SuperAdmin only - Delete admin

---

### Student Authentication

#### POST `/api/student/login`
**Public** - Student login
```json
Request:
{
  "email": "student@example.com", // or rollNumber
  "password": "password123"
}
```

#### POST `/api/student/set-password`
**Public** - First time password setup
```json
Request:
{
  "email": "student@example.com",
  "dateOfBirth": "2010-01-15",
  "newPassword": "newpassword123"
}
```

#### GET `/api/student/profile`
**Protected** - Student - Get own profile

#### PUT `/api/student/profile`
**Protected** - Student - Update limited fields

#### PUT `/api/student/change-password`
**Protected** - Student - Change password

#### PUT `/api/student/:id/reset-password`
**Protected** - Admin only - Reset student password

---

## 👨‍🎓 STUDENT MANAGEMENT

#### POST `/api/students/create`
**Protected** - Admin only
```json
{
  "fullName": "John Smith",
  "email": "john.student@example.com",
  "phone": "9876543210",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "address": "123 Main St",
  "guardianName": "Jane Smith",
  "guardianPhone": "9876543211",
  "class": "10",
  "section": "A",
  "rollNumber": "2024001",
  "admissionDate": "2024-04-01"
}
```

#### GET `/api/students`
**Public** - Get all students

#### GET `/api/students/:id`
**Public** - Get single student

#### PUT `/api/students/:id/update`
**Protected** - Admin only - Update student

#### DELETE `/api/students/:id/delete`
**Protected** - Admin only - Delete student

#### GET `/api/students/class/:class`
**Public** - Get students by class

#### GET `/api/students/status/:status`
**Public** - Get students by status

---

## 👨‍🏫 STAFF MANAGEMENT

#### POST `/api/staff/create`
**Protected** - Admin only

#### GET `/api/staff`
**Public** - Get all staff

#### GET `/api/staff/:id`
**Public** - Get single staff

#### PUT `/api/staff/:id/update`
**Protected** - Admin only

#### DELETE `/api/staff/:id/delete`
**Protected** - Admin only

---

## 📊 ATTENDANCE MANAGEMENT

#### POST `/api/attendance/mark`
**Protected** - Admin only - Mark single attendance
```json
{
  "studentId": 1,
  "date": "2024-02-07",
  "status": "present",
  "class": "10",
  "section": "A",
  "remarks": "On time"
}
```

#### POST `/api/attendance/bulk`
**Protected** - Admin only - Mark attendance for whole class
```json
{
  "date": "2024-02-07",
  "class": "10",
  "section": "A",
  "attendanceRecords": [
    { "studentId": 1, "status": "present" },
    { "studentId": 2, "status": "absent", "remarks": "Sick" }
  ]
}
```

#### GET `/api/attendance/student/:studentId?startDate=2024-01-01&endDate=2024-01-31`
**Public** - Get student attendance with stats

#### GET `/api/attendance/class?date=2024-02-07&class=10&section=A`
**Protected** - Admin - Get class attendance

#### DELETE `/api/attendance/:id`
**Protected** - Admin only

---

## 📝 GRADES MANAGEMENT

#### POST `/api/grades/add`
**Protected** - Admin only
```json
{
  "studentId": 1,
  "subject": "Mathematics",
  "examType": "First Terminal",
  "marksObtained": 85,
  "totalMarks": 100,
  "class": "10",
  "section": "A",
  "academicYear": "2023-2024",
  "remarks": "Excellent performance"
}
```

#### GET `/api/grades/student/:studentId?examType=First Terminal&academicYear=2023-2024`
**Public** - Get student grades

#### GET `/api/grades/class?class=10&section=A&examType=Final&academicYear=2023-2024`
**Protected** - Admin - Get class grades

#### PUT `/api/grades/:id`
**Protected** - Admin only - Update grade

#### DELETE `/api/grades/:id`
**Protected** - Admin only

---

## 💰 FEE MANAGEMENT

#### POST `/api/fees/create`
**Protected** - Admin only
```json
{
  "studentId": 1,
  "feeType": "Tuition",
  "amount": 5000,
  "dueDate": "2024-03-01",
  "academicYear": "2023-2024"
}
```

#### POST `/api/fees/:id/payment`
**Protected** - Admin only - Record payment
```json
{
  "paidAmount": 5000,
  "paymentDate": "2024-02-15",
  "paymentMethod": "Cash",
  "receiptNumber": "RCP2024001"
}
```

#### GET `/api/fees/student/:studentId?status=pending&academicYear=2023-2024`
**Public** - Get student fees with summary

#### GET `/api/fees?status=overdue&academicYear=2023-2024`
**Protected** - Admin - Get all fees

#### PUT `/api/fees/:id`
**Protected** - Admin only

#### DELETE `/api/fees/:id`
**Protected** - Admin only

---

## 📅 TIMETABLE MANAGEMENT

#### POST `/api/timetable/create`
**Protected** - Admin only
```json
{
  "class": "10",
  "section": "A",
  "day": "Monday",
  "subject": "Mathematics",
  "teacher": "John Doe",
  "teacherId": 5,
  "startTime": "09:00:00",
  "endTime": "09:45:00",
  "room": "Room 101",
  "academicYear": "2023-2024"
}
```

#### GET `/api/timetable/class?class=10&section=A&academicYear=2023-2024`
**Public** - Get class timetable

#### GET `/api/timetable/teacher/:teacherId`
**Public** - Get teacher timetable

#### PUT `/api/timetable/:id`
**Protected** - Admin only

#### DELETE `/api/timetable/:id`
**Protected** - Admin only

---

## 📚 ASSIGNMENT MANAGEMENT

#### POST `/api/assignments/create`
**Protected** - Admin only
```json
{
  "title": "Algebra Homework",
  "description": "Complete exercises 1-10 from Chapter 5",
  "class": "10",
  "section": "A",
  "subject": "Mathematics",
  "dueDate": "2024-02-15",
  "totalMarks": 100,
  "attachments": "[\"url1\", \"url2\"]"
}
```

#### GET `/api/assignments?class=10&section=A&subject=Mathematics`
**Public** - Get assignments

#### GET `/api/assignments/:id`
**Public** - Get single assignment

#### PUT `/api/assignments/:id`
**Protected** - Admin only

#### DELETE `/api/assignments/:id`
**Protected** - Admin only

#### POST `/api/assignments/:assignmentId/submit`
**Protected** - Student only - Submit assignment
```json
{
  "content": "My solution...",
  "attachments": "[\"url1\"]"
}
```

#### PUT `/api/submissions/:id/grade`
**Protected** - Admin only - Grade submission
```json
{
  "marksObtained": 85,
  "feedback": "Well done!"
}
```

#### GET `/api/assignments/:assignmentId/submissions`
**Protected** - Admin - Get all submissions for assignment

#### GET `/api/submissions/my`
**Protected** - Student - Get own submissions

---

## 🏖️ LEAVE MANAGEMENT

#### POST `/api/leaves/apply`
**Protected** - Student only
```json
{
  "applicantType": "student",
  "applicantId": 1,
  "leaveType": "Sick",
  "startDate": "2024-02-10",
  "endDate": "2024-02-12",
  "reason": "Fever and cold"
}
```

#### GET `/api/leaves?status=pending&applicantType=student`
**Protected** - Admin - Get leave applications

#### GET `/api/leaves/my/:applicantType/:applicantId`
**Public** - Get my leaves

#### PUT `/api/leaves/:id/review`
**Protected** - Admin only - Approve/Reject
```json
{
  "status": "approved",
  "reviewRemarks": "Approved. Get well soon."
}
```

#### DELETE `/api/leaves/:id`
**Protected** - Admin only

---

## 📢 ANNOUNCEMENTS

#### POST `/api/announcements/create`
**Protected** - Admin only
```json
{
  "title": "Sports Day Announcement",
  "content": "Annual sports day will be held on...",
  "targetAudience": "all",
  "priority": "high",
  "expiryDate": "2024-03-01"
}
```

#### GET `/api/announcements?targetAudience=students&priority=urgent`
**Public** - Get announcements

#### GET `/api/announcements/:id`
**Public** - Get single announcement

#### PUT `/api/announcements/:id`
**Protected** - Admin only

#### DELETE `/api/announcements/:id`
**Protected** - Admin only

---

## 📖 PROGRAMS & BLOGS

#### GET `/api/programs`
**Public** - Get all programs

#### POST `/api/programs`
**Protected** - Admin only - Create program

#### GET `/api/blogs`
**Public** - Get all blogs

#### POST `/api/blogs/create`
**Protected** - Admin only - Create blog

---

## 🚀 SETUP & INSTALLATION

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
Create `.env` file:
```env
DB_NAME=jkss_school
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_DIALECT=postgres
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
PORT=4000
```

3. **Run database migrations**
```bash
npm start
```

4. **Create super admin**
```bash
npm run create-admin
```
Default credentials:
- Email: `superadmin@jkss.com`
- Password: `admin123`

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Run development server**
```bash
npm run dev
```

---

## 🔑 AUTHENTICATION FLOW

### Admin Flow:
1. Admin logs in at `/admin/login`
2. Receives JWT token with `type: 'admin'`
3. Token stored in localStorage
4. Protected routes verify admin token using `protectAdmin` middleware
5. Super admin routes additionally check `requireSuperAdmin` middleware

### Student Flow:
1. Student logs in at `/student/login` (email/rollNumber + password)
2. First-time students set password using `/student/set-password` (requires email + DOB verification)
3. Receives JWT token with `type: 'student'`
4. Protected routes verify student token using `protectStudent` middleware
5. Students can only access their own data

---

## 📊 DATABASE MODELS

### Models Created:
- ✅ admins (superAdmin, admin)
- ✅ students (with password for login)
- ✅ staff
- ✅ attendance
- ✅ grades
- ✅ fees
- ✅ timetables
- ✅ assignments
- ✅ submissions
- ✅ leaves
- ✅ announcements
- ✅ blogs
- ✅ programs
- ✅ activities

---

## 🎯 KEY FEATURES

### Admin Dashboard Features:
- ✅ Student management (CRUD)
- ✅ Staff management (CRUD)
- ✅ Attendance tracking (individual & bulk)
- ✅ Grade management with auto-calculation
- ✅ Fee collection & tracking
- ✅ Timetable management
- ✅ Assignment creation & grading
- ✅ Leave approval system
- ✅ Announcements
- ✅ Admin management (SuperAdmin only)

### Student Portal Features:
- ✅ View own profile & grades
- ✅ View attendance records
- ✅ View fee status
- ✅ Submit assignments
- ✅ Apply for leaves
- ✅ View timetable
- ✅ View announcements
- ✅ Update limited profile info

---

## 🔒 SECURITY FEATURES

- JWT-based authentication
- Separate tokens for admin & student
- Password hashing with bcryptjs
- Role-based access control
- Protected routes with middleware
- Token expiration handling
- Status-based account access
- SuperAdmin privilege separation

---

## 📱 API RESPONSE FORMAT

### Success Response:
```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Response:
```json
{
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## 🎨 FRONTEND ROUTES

- `/` - Home
- `/admin/login` - Admin login
- `/student/login` - Student login
- `/admin/dashboard` - Admin dashboard
- `/student/dashboard` - Student dashboard (to be created)

---

## 📝 TODO / FUTURE ENHANCEMENTS

- [ ] Student dashboard UI
- [ ] Parent portal
- [ ] File upload functionality
- [ ] Email notifications
- [ ] SMS integration
- [ ] Report card generation
- [ ] Certificate generation
- [ ] Library management
- [ ] Transport management
- [ ] Hostel management
- [ ] Exam hall allocation
- [ ] Online exam system

---

## 👨‍💻 DEVELOPER NOTES

### Tech Stack:
- **Backend**: Node.js, Express.js, Sequelize ORM, PostgreSQL
- **Frontend**: React, TypeScript, React Router, Axios
- **Authentication**: JWT, bcryptjs
- **Middleware**: CORS, express.json()

### Project Structure:
```
backend/
├── controllers/     # Business logic
├── database/       
│   ├── models/     # Sequelize models
│   └── connection.js
├── middlewares/    # Auth middleware
├── routes/         # API routes
├── app.js          # Express app
└── insertAdmin.js  # Admin creation utility

frontend/
└── src/
    ├── components/ # Reusable components
    ├── pages/      # Page components
    ├── layouts/    # Layout components
    └── App.tsx
```

---

**Last Updated**: February 7, 2026
**Version**: 2.0.0
**Developed for**: JKSS School, Babai


require('dotenv').config();

const express = require('express');
const programRoute = require('./routes/programRoute');
const publicBlogRoute = require('./routes/publicBlogRoute');
const adminBlogRoute = require('./routes/adminBlogRoute');
const adminAuthRoute = require('./routes/adminAuthRoute');
const studentAuthRoute = require('./routes/studentAuthRoute');
const studentRoute = require('./routes/studentRoute');
const staffRoute = require('./routes/staffRoute');
const teacherRoute = require('./routes/teacherRoute');
const classRoute = require('./routes/classRoute');
const attendanceRoute = require('./routes/attendanceRoute');
const gradeRoute = require('./routes/gradeRoute');
const feeRoute = require('./routes/feeRoute');
const feeManagementRoute = require('./routes/feeManagementRoute');
const leaveRoute = require('./routes/leaveRoute');
const announcementRoute = require('./routes/announcementRoute');
const timetableRoute = require('./routes/timetableRoute');
const assignmentRoute = require('./routes/assignmentRoute');
const contentRoute = require('./routes/contentRoute');
const galleryRoute = require('./routes/galleryRoute');
const downloadRoute = require('./routes/downloadRoute');
const heroSlideRoute = require('./routes/heroSlideRoute');
const schoolProfileRoute = require('./routes/schoolProfileRoute');
const messageRoute = require('./routes/messageRoute');
const contactRoute = require('./routes/contactRoute');
const careerRoute = require('./routes/careerRoute');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: [
    'https://jkssp5padampur.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Authentication routes
app.use("/api/", adminAuthRoute);
app.use("/api/", studentAuthRoute);

// Resource routes
app.use("/api/", programRoute);
app.use("/api/", publicBlogRoute);
app.use("/api/", adminBlogRoute);
app.use("/api/", studentRoute);
app.use("/api/", staffRoute);
app.use("/api/", teacherRoute);
app.use("/api/", classRoute);
app.use("/api/", attendanceRoute);
app.use("/api/", gradeRoute);
app.use("/api/", feeRoute);
app.use("/api/fee-management", feeManagementRoute);
app.use("/api/", leaveRoute);
app.use("/api/", announcementRoute);
app.use("/api/", timetableRoute);
app.use("/api/", assignmentRoute);
app.use("/api/", contentRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/", downloadRoute);
app.use("/api/", heroSlideRoute);
app.use("/api/school-profile", schoolProfileRoute);
app.use("/api/messages", messageRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/career", careerRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the JKS School API');
});

// Health check endpoint for debugging
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasDbString: !!process.env.db_string,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
});

// Debug route to check available student routes
app.get('/api/debug/routes', (req, res) => {
  res.json({
    message: 'Available student routes',
    routes: {
      students: {
        'GET /api/students': 'List all students',
        'GET /api/students/:id': 'Get single student',
        'POST /api/students/create': 'Create new student (with photo upload)',
        'PUT /api/students/:id/update': 'Update student (with photo upload)',
        'DELETE /api/students/:id/delete': 'Delete student',
        'GET /api/students/class/:className': 'Get students by class',
        'GET /api/students/status/:status': 'Get students by status'
      },
      note: 'Protected routes require Bearer token in Authorization header'
    }
  });
});

// Export for Vercel serverless
module.exports = app;

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

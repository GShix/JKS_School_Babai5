const express = require('express');
const programRoute = require('./routes/programRoute');
const blogRoute = require('./routes/blogRoute');
const adminAuthRoute = require('./routes/adminAuthRoute');
const studentAuthRoute = require('./routes/studentAuthRoute');
const studentRoute = require('./routes/studentRoute');
const staffRoute = require('./routes/staffRoute');
const teacherRoute = require('./routes/teacherRoute');
const attendanceRoute = require('./routes/attendanceRoute');
const gradeRoute = require('./routes/gradeRoute');
const feeRoute = require('./routes/feeRoute');
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
  origin: '*', // Allows all origins
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false // Set to true if you need to send cookies
}));

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication routes
app.use("/api/", adminAuthRoute);
app.use("/api/", studentAuthRoute);

// Resource routes
app.use("/api/", programRoute);
app.use("/api/", blogRoute);
app.use("/api/", studentRoute);
app.use("/api/", staffRoute);
app.use("/api/", teacherRoute);
app.use("/api/", attendanceRoute);
app.use("/api/", gradeRoute);
app.use("/api/", feeRoute);
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

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

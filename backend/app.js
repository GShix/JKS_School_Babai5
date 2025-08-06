const { fetchPrograms, addProgram } = require('./controllers/programController');

const express = require('express');
const programRoute = require('./routes/programRoute')
const blogRoute = require('./routes/blogRoute');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: '*', // Allows all origins
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false // Set to true if you need to send cookies
}));  

app.use("/api/", programRoute)
app.use("/api/",blogRoute)

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

const { fetchPrograms, addProgram } = require('./controllers/programController');

const express = require('express');
const programRoute = require('./routes/programRoute')
const blogRoute = require('./routes/blogRoute');
const app = express();

app.use(express.json());

// const cors = require('cors');
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));  
app.use("/api/", programRoute)
app.use("/api/",blogRoute)

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

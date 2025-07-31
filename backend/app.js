const db = require('./database/connection');
const { programs } = db;

const express = require('express');
const app = express();

app.use(express.json());

// const cors = require('cors');
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));  

app.get("/programs", async(req, res) => {
  const allPrograms = await programs.findAll();
  res.json({
    message: 'List of programs will be here',
    data: allPrograms
  })
});


app.post("/programs", async(req, res) => {
  try {
    const {programName, programDescription, programStatus, programImage} = req.body;
    
    const newProgram = await programs.create({
      programName,
      programDescription,
      programStatus,
      programImage
    });

    res.json({
      message: 'Program created successfully',
      data: newProgram
    });
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({
      message: 'Error creating program',
      error: error.message
    });
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

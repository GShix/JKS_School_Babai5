const { programs } = require('../database/connection');

exports.fetchPrograms =  async(req, res) => {
  const allPrograms = await programs.findAll();
  res.json({
    message: 'List of programs will be here',
    data: allPrograms
  })
}

exports.addProgram = async(req, res) => {
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
}

exports.fetchSingleProgram = async(req, res) => {
  const { id } = req.params;
  const program = await programs.findByPk(id);
  if (program) {
    res.json({
      message: 'Program details',
      data: program
    });
  } else {
    res.status(404).json({
      message: 'Program not found'
    });
  }
}

exports.deleteProgram = async(req, res) => {
  const { id } = req.params;
  const program = await programs.findByPk(id);
  if (program) {
    await programs.destroy({ 
      where: 
      { 
        id 
      } 
    });
    res.json({
      message: 'Program deleted successfully'
    });
  } else {
    res.status(404).json({
      message: 'Program not found'
    });
  }
}

exports.updateProgram = async(req, res) => {
  const { id } = req.params;
  const { programName, programDescription, programStatus, programImage } = req.body;

  try {
    const program = await programs.findByPk(id);
    if (!program) {
      return res.status(404).json({
        message: 'Program not found'
      });
    }

    const updatedProgram = await program.update({
      programName,
      programDescription,
      programStatus,
      programImage
    });
    // const updatedProgram = await programs.update({},{where:{id:id}});

    res.json({
      message: 'Program updated successfully',
      data: updatedProgram
    });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({
      message: 'Error updating program',
      error: error.message
    });
  }
}
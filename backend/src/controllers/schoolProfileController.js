const { schoolProfile } = require('../database/connection');

// Get school profile
const getSchoolProfile = async (req, res) => {
  try {
    const profile = await schoolProfile.findOne({
      order: [['id', 'DESC']]
    });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching school profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school profile',
      error: error.message
    });
  }
};

// Update school profile
const updateSchoolProfile = async (req, res) => {
  try {
    const {
      schoolName,
      schoolNameNepali,
      phone,
      email,
      address,
      addressNepali,
      province,
      district,
      municipality,
      ward,
      introduction,
      establishedYear,
      principalName,
      website,
      facebookUrl
    } = req.body;

    const profileData = {
      schoolName,
      schoolNameNepali,
      phone,
      email,
      address,
      addressNepali,
      province,
      district,
      municipality,
      ward,
      introduction,
      establishedYear,
      principalName,
      website,
      facebookUrl
    };

    // Check if profile exists
    const existingProfile = await schoolProfile.findOne();
    
    if (!existingProfile) {
      // Create new profile
      const newProfile = await schoolProfile.create(profileData);
      
      return res.json({
        success: true,
        message: 'School profile created successfully',
        data: newProfile
      });
    } else {
      // Update existing profile
      await existingProfile.update(profileData);
      
      res.json({
        success: true,
        message: 'School profile updated successfully',
        data: existingProfile
      });
    }
  } catch (error) {
    console.error('Error updating school profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update school profile',
      error: error.message
    });
  }
};

module.exports = {
  getSchoolProfile,
  updateSchoolProfile
};

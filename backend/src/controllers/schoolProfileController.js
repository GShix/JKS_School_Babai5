const { schoolProfile } = require('../database/connection');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');

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
      fax,
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
      facebookUrl,
      logoUrl,
      panNumber,
      registrationNumber,
      affiliation,
      taxPercentage
    } = req.body;

    let finalLogoUrl = logoUrl; // Use provided logoUrl by default

    // Handle logo file upload if present
    if (req.file) {
      try {
        const uploadResult = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname || `logo-${Date.now()}.png`,
          'school-logos',
          req.file.mimetype
        );
        finalLogoUrl = uploadResult.url;
        
        // Delete old logo if exists and is different
        const existingProfile = await schoolProfile.findOne();
        if (existingProfile?.logoUrl && existingProfile.logoUrl !== finalLogoUrl) {
          try {
            await deleteFromSupabase(existingProfile.logoUrl, 'school-logos');
          } catch (deleteError) {
            console.warn('Could not delete old logo:', deleteError.message);
          }
        }
      } catch (uploadError) {
        console.error('Error uploading logo:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading school logo',
          error: uploadError.message,
        });
      }
    }

    const profileData = {
      schoolName,
      schoolNameNepali,
      phone,
      fax,
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
      facebookUrl,
      logoUrl: finalLogoUrl,
      panNumber,
      registrationNumber,
      affiliation,
      taxPercentage: taxPercentage ? parseFloat(taxPercentage) : 0.00
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

const { contents } = require('../database/connection');

// Get all content for a section
exports.getContentBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const { language = 'en' } = req.query;

    const content = await contents.findAll({
      where: {
        section,
        language,
        status: 'active'
      },
      order: [['order', 'ASC'], ['key', 'ASC']]
    });

    // Transform to key-value object for easier frontend consumption
    const contentObject = {};
    content.forEach(item => {
      if (item.valueType === 'json' && item.value) {
        try {
          contentObject[item.key] = JSON.parse(item.value);
        } catch (e) {
          contentObject[item.key] = item.value;
        }
      } else {
        contentObject[item.key] = item.value;
      }

      // Include metadata if available
      if (item.metadata) {
        contentObject[`${item.key}_metadata`] = item.metadata;
      }
    });

    res.status(200).json({
      success: true,
      section,
      language,
      data: contentObject,
      raw: content // Include raw data for admin panel
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// Get school profile (combined data)
exports.getSchoolProfile = async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const content = await contents.findAll({
      where: {
        section: 'school_profile',
        language,
        status: 'active'
      },
      order: [['key', 'ASC']]
    });

    const profile = {};
    content.forEach(item => {
      if (item.valueType === 'json' && item.value) {
        try {
          profile[item.key] = JSON.parse(item.value);
        } catch (e) {
          profile[item.key] = item.value;
        }
      } else {
        profile[item.key] = item.value;
      }
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching school profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching school profile',
      error: error.message
    });
  }
};

// Update or create school profile
exports.updateSchoolProfile = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const profileData = req.body;

    const updates = [];

    for (const [key, value] of Object.entries(profileData)) {
      const valueType = typeof value === 'object' ? 'json' : 'text';
      const finalValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

      const [content, created] = await contents.findOrCreate({
        where: {
          section: 'school_profile',
          key,
          language
        },
        defaults: {
          value: finalValue,
          valueType,
          status: 'active'
        }
      });

      if (!created) {
        await content.update({
          value: finalValue,
          valueType
        });
      }

      updates.push({ key, created });
    }

    res.status(200).json({
      success: true,
      message: 'School profile updated successfully',
      updates
    });
  } catch (error) {
    console.error('Error updating school profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating school profile',
      error: error.message
    });
  }
};

// Get all content items (for admin panel)
exports.getAllContent = async (req, res) => {
  try {
    const { section, category, language, status } = req.query;

    const where = {};
    if (section) where.section = section;
    if (category) where.category = category;
    if (language) where.language = language;
    if (status) where.status = status;

    const content = await contents.findAll({
      where,
      order: [['section', 'ASC'], ['order', 'ASC'], ['key', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    console.error('Error fetching all content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// Create content item
exports.createContent = async (req, res) => {
  try {
    const { section, key, value, valueType, metadata, category, language, status, order } = req.body;

    if (!section || !key) {
      return res.status(400).json({
        success: false,
        message: 'Section and key are required'
      });
    }

    const content = await contents.create({
      section,
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : value,
      valueType: valueType || (typeof value === 'object' ? 'json' : 'text'),
      metadata,
      category,
      language: language || 'en',
      status: status || 'active',
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating content',
      error: error.message
    });
  }
};

// Update content item
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const content = await contents.findByPk(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Handle value transformation
    if (updates.value !== undefined) {
      updates.value = typeof updates.value === 'object' ? JSON.stringify(updates.value) : updates.value;
      if (!updates.valueType) {
        updates.valueType = typeof updates.value === 'object' ? 'json' : 'text';
      }
    }

    await content.update(updates);

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
};

// Delete content item
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await contents.findByPk(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await content.destroy();

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content',
      error: error.message
    });
  }
};

// Bulk update content for a section
exports.bulkUpdateContent = async (req, res) => {
  try {
    const { section, language = 'en', content } = req.body;

    if (!section || !content) {
      return res.status(400).json({
        success: false,
        message: 'Section and content are required'
      });
    }

    const updates = [];

    for (const [key, value] of Object.entries(content)) {
      const valueType = typeof value === 'object' ? 'json' : 'text';
      const finalValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

      const [contentItem, created] = await contents.findOrCreate({
        where: { section, key, language },
        defaults: {
          value: finalValue,
          valueType,
          status: 'active'
        }
      });

      if (!created) {
        await contentItem.update({
          value: finalValue,
          valueType
        });
      }

      updates.push({ key, created });
    }

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      updates
    });
  } catch (error) {
    console.error('Error bulk updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
};

// Initialize default school content with Nepali name
exports.initializeDefaultContent = async (req, res) => {
  try {
    const defaultContent = [
      // School Profile - Nepali
      { section: 'school_profile', key: 'schoolNameNepali', value: 'श्री जनकल्याण', language: 'ne', valueType: 'text' },
      { section: 'school_profile', key: 'schoolTypeNepali', value: 'माध्यमिक विद्यालय:', language: 'ne', valueType: 'text' },

      // School Profile - English
      { section: 'school_profile', key: 'schoolName', value: 'Janakalyan Higher Secondary School', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'established', value: '2045 B.S.', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'address', value: 'Babai Rural Municipality-5, Bhangabari, Dang', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'phone', value: '+977-82-XXXXXX', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'email', value: 'info@jkschool.edu.np', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'principalName', value: 'Principal Name', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'principalMessage', value: 'Welcome to Janakalyan Higher Secondary School...', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'mission', value: 'To provide quality education and develop well-rounded individuals.', language: 'en', valueType: 'text' },
      { section: 'school_profile', key: 'vision', value: 'To be a leading educational institution in Nepal.', language: 'en', valueType: 'text' },

      // Hero Section
      { section: 'hero', key: 'title', value: 'Welcome to Janakalyan School', language: 'en', valueType: 'text' },
      { section: 'hero', key: 'subtitle', value: 'Excellence in Education Since 2045 B.S.', language: 'en', valueType: 'text' },
      { section: 'hero', key: 'backgroundImage', value: '/img/running-shield-blur.jpg', language: 'en', valueType: 'url' },
    ];

    const results = [];
    for (const item of defaultContent) {
      const [content, created] = await contents.findOrCreate({
        where: {
          section: item.section,
          key: item.key,
          language: item.language
        },
        defaults: {
          value: item.value,
          valueType: item.valueType,
          status: 'active',
          order: 0
        }
      });
      results.push({ ...item, created });
    }

    res.status(200).json({
      success: true,
      message: 'Default content initialized',
      data: results
    });
  } catch (error) {
    console.error('Error initializing content:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing content',
      error: error.message
    });
  }
};

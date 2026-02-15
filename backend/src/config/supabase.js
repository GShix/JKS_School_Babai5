const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
// Use SERVICE_ROLE_KEY for backend operations to bypass Row Level Security
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not configured. Image upload will not work.');
  console.warn('⚠️  Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env file to enable image uploads.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase client initialized successfully (using Service Role Key)');
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error.message);
  }
}

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Desired file name
 * @param {string} bucket - Storage bucket name (default: 'staff-images')
 * @param {string} mimeType - File MIME type (optional, will be detected from filename)
 * @returns {Promise<{url: string, path: string}>}
 */
const uploadToSupabase = async (fileBuffer, fileName, bucket = 'staff-images', mimeType = null) => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      throw new Error('Supabase is not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file.');
    }

    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName.replace(/\s+/g, '-')}`;
    
    // Determine content type from filename if not provided
    let contentType = mimeType || 'image/jpeg';
    if (!mimeType) {
      const ext = fileName.toLowerCase().split('.').pop();
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'pdf': 'application/pdf'
      };
      contentType = mimeTypes[ext] || 'image/jpeg';
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, fileBuffer, {
        contentType: contentType,
        upsert: false,
        cacheControl: '3600'
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return {
      url: publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - File path in storage
 * @param {string} bucket - Storage bucket name
 */
const deleteFromSupabase = async (filePath, bucket = 'staff-images') => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Supabase is not configured. Skipping image deletion.');
      return;
    }

    if (!filePath) return;
    
    // Extract filename from URL if full URL is provided
    const fileName = filePath.includes('/') ? filePath.split('/').pop() : filePath;
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Error deleting from Supabase:', error);
    }
  } catch (error) {
    console.error('Error in deleteFromSupabase:', error);
  }
};

module.exports = {
  supabase,
  uploadToSupabase,
  deleteFromSupabase
};

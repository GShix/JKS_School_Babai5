const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('Supabase client created successfully.');
  } catch (error) {
    console.error('Supabase connection error: ', error.message);
  }
}

const uploadToSupabase = async (fileBuffer, fileName, bucket = 'staff-images', mimeType = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName.replace(/\s+/g, '-')}`;

    // Determine content type from filename if not provided
    let contentType = mimeType || 'image/jpeg';
    if (!mimeType) {
      const ext = fileName.toLowerCase().split('.').pop();
      const mimeTypes = {
        'jpg': 'image/jpg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'pdf': 'application/pdf'
      };
      contentType = mimeTypes[ext] || 'image/jpeg';
    }

    let { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, fileBuffer, {
        contentType: contentType,
        upsert: false,
        cacheControl: '3600'
      });

    // If bucket not found, try to create it and retry
    if (error && error.message && error.message.includes('Bucket not found')) {
      console.log(`Bucket "${bucket}" not found. Creating it...`);
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      if (createError && !createError.message.includes('already exists')) {
        throw new Error(`Failed to create bucket "${bucket}": ${createError.message}`);
      }
      // Retry upload after bucket creation
      ({ data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, fileBuffer, {
          contentType: contentType,
          upsert: false,
          cacheControl: '3600'
        }));
    }

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

const deleteFromSupabase = async (filePath, bucket = 'staff-images') => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Supabase is not configured.');
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

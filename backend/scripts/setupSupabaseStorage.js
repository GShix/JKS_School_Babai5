/**
 * Supabase Storage Setup Script
 * 
 * This script creates the required storage buckets in Supabase.
 * Run this once to set up your Supabase storage.
 * 
 * Usage: node setupSupabaseStorage.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket(bucketName, isPublic = true, options = {}) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    // Default options
    const defaultOptions = {
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    };

    const bucketOptions = { ...defaultOptions, ...options };

    if (bucketExists) {
      console.log(`✅ Bucket "${bucketName}" already exists`);

      // Update bucket to ensure it's public if needed
      if (isPublic) {
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
          public: true,
          ...bucketOptions
        });

        if (updateError) {
          console.warn(`⚠️  Warning: Could not update bucket settings: ${updateError.message}`);
        } else {
          console.log(`✅ Bucket "${bucketName}" updated with correct settings`);
        }
      }

      return true;
    }

    // Create bucket
    console.log(`Creating bucket: ${bucketName}...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      ...bucketOptions
    });

    if (error) {
      throw new Error(`Error creating bucket: ${error.message}`);
    }

    console.log(`✅ Successfully created bucket: ${bucketName}`);
    return true;

  } catch (error) {
    console.error(`❌ Error with bucket "${bucketName}":`, error.message);
    return false;
  }
}

async function setupStorage() {
  console.log('\n🚀 Setting up Supabase Storage...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  const buckets = [
    {
      name: 'staff-images',
      public: true,
      options: {
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      }
    },
    {
      name: 'student-images',
      public: true,
      options: {
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      }
    },
    {
      name: 'blog-images',
      public: true,
      options: {
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      }
    },
    {
      name: 'downloads',
      public: true,
      options: {
        fileSizeLimit: 10485760, // 10MB for documents and images
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      }
    },
    {
      name: 'hero-slides',
      public: true,
      options: {
        fileSizeLimit: 5242880, // 5MB for hero images
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      }
    },
    {
      name: 'teacher-images',
      public: true,
      options: {
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      }
    },
  ];

  let successCount = 0;

  for (const bucket of buckets) {
    const success = await createBucket(bucket.name, bucket.public, bucket.options);
    if (success) successCount++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Setup Complete! ${successCount}/${buckets.length} buckets ready`);
  console.log('='.repeat(50) + '\n');

  if (successCount === buckets.length) {
    console.log('🎉 All storage buckets are set up and ready to use!');
    console.log('\nYou can now:');
    console.log('  • Upload staff profile images');
    console.log('  • Upload student profile images');
    console.log('  • Upload blog featured images');
    console.log('  • Upload download files (notes, question papers, etc.)');
    console.log('\n💡 Restart your backend server to use the new storage.\n');
  } else {
    console.log('⚠️  Some buckets could not be created. Please check the errors above.');
    console.log('\n📖 Manual Setup Instructions:');
    console.log('  1. Go to https://supabase.com/dashboard');
    console.log('  2. Select your project');
    console.log('  3. Go to Storage section');
    console.log('  4. Create these public buckets:');
    buckets.forEach(b => console.log(`     - ${b.name}`));
    console.log('  5. Set each bucket as PUBLIC');
    console.log('  6. Set file size limit to 5MB\n');
  }
}

// Run setup
setupStorage()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  });

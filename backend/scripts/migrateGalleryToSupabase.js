
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { gallery } = require('../src/database/connection');
const { uploadToSupabase } = require('../src/config/supabase');

// Path to local uploads folder
const UPLOADS_DIR = path.join(__dirname, '../uploads/gallery');

async function migrateGalleryImages() {
  console.log('🚀 Starting gallery images migration to Supabase...\n');

  try {
    // Get all gallery items from database
    const galleryItems = await gallery.findAll();
    
    if (galleryItems.length === 0) {
      console.log('ℹ️  No gallery items found in database.');
      return;
    }

    console.log(`📂 Found ${galleryItems.length} gallery item(s) in database.\n`);

    let totalImagesProcessed = 0;
    let totalVideosProcessed = 0;
    let totalUpdated = 0;

    // Process each gallery item
    for (const item of galleryItems) {
      console.log(`\n📌 Processing Gallery Item #${item.id}: "${item.title}"`);
      
      let needsUpdate = false;
      const updatedImages = [];
      const updatedVideos = [];

      // Process images
      if (item.images && item.images.length > 0) {
        for (const image of item.images) {
          // Check if image URL is a local path (starts with /uploads)
          if (image.url && image.url.startsWith('/uploads')) {
            const localPath = path.join(__dirname, '..', image.url);
            
            // Check if file exists locally
            if (fs.existsSync(localPath)) {
              try {
                console.log(`  ⬆️  Uploading image: ${image.originalName || image.filename}`);
                
                // Read file buffer
                const fileBuffer = fs.readFileSync(localPath);
                
                // Upload to Supabase
                const uploadResult = await uploadToSupabase(
                  fileBuffer,
                  image.originalName || image.filename,
                  'gallery-images',
                  image.fileType || 'image/jpeg'
                );
                
                // Update image object with Supabase URL
                updatedImages.push({
                  ...image,
                  url: uploadResult.url,
                  filename: uploadResult.path
                });
                
                console.log(`  ✅ Uploaded successfully: ${uploadResult.url}`);
                totalImagesProcessed++;
                needsUpdate = true;
              } catch (error) {
                console.error(`  ❌ Error uploading ${image.filename}:`, error.message);
                // Keep original image data if upload fails
                updatedImages.push(image);
              }
            } else {
              console.log(`  ⚠️  File not found locally: ${localPath}`);
              // Keep original image data
              updatedImages.push(image);
            }
          } else {
            // Already uploaded to Supabase or external URL
            console.log(`  ℹ️  Skipping (already migrated): ${image.url}`);
            updatedImages.push(image);
          }
        }
      }

      // Process videos (if any)
      if (item.videos && item.videos.length > 0) {
        for (const video of item.videos) {
          // Check if video URL is a local path
          if (video.url && video.url.startsWith('/uploads')) {
            const localPath = path.join(__dirname, '..', video.url);
            
            if (fs.existsSync(localPath)) {
              try {
                console.log(`  ⬆️  Uploading video: ${video.originalName || video.filename}`);
                
                const fileBuffer = fs.readFileSync(localPath);
                
                const uploadResult = await uploadToSupabase(
                  fileBuffer,
                  video.originalName || video.filename,
                  'gallery-videos',
                  video.fileType || 'video/mp4'
                );
                
                updatedVideos.push({
                  ...video,
                  url: uploadResult.url,
                  filename: uploadResult.path
                });
                
                console.log(`  ✅ Uploaded successfully: ${uploadResult.url}`);
                totalVideosProcessed++;
                needsUpdate = true;
              } catch (error) {
                console.error(`  ❌ Error uploading ${video.filename}:`, error.message);
                updatedVideos.push(video);
              }
            } else {
              console.log(`  ⚠️  File not found locally: ${localPath}`);
              updatedVideos.push(video);
            }
          } else {
            console.log(`  ℹ️  Skipping (already migrated): ${video.url}`);
            updatedVideos.push(video);
          }
        }
      }

      // Update database if any files were migrated
      if (needsUpdate) {
        try {
          await item.update({
            images: updatedImages.length > 0 ? updatedImages : item.images,
            videos: updatedVideos.length > 0 ? updatedVideos : item.videos
          });
          console.log(`  💾 Database updated for Gallery Item #${item.id}`);
          totalUpdated++;
        } catch (error) {
          console.error(`  ❌ Error updating database:`, error.message);
        }
      } else {
        console.log(`  ℹ️  No changes needed for this item.`);
      }
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log('✅ Migration Complete!');
    console.log(`${'='.repeat(60)}`);
    console.log(`📊 Summary:`);
    console.log(`   - Gallery items processed: ${galleryItems.length}`);
    console.log(`   - Images migrated: ${totalImagesProcessed}`);
    console.log(`   - Videos migrated: ${totalVideosProcessed}`);
    console.log(`   - Database records updated: ${totalUpdated}`);
    console.log(`${'='.repeat(60)}\n`);

    if (totalImagesProcessed > 0 || totalVideosProcessed > 0) {
      console.log('🎉 Your gallery images/videos are now in Supabase Storage!');
      console.log('📝 Next steps:');
      console.log('   1. Verify images appear correctly on your frontend');
      console.log('   2. Deploy updated backend to Vercel');
      console.log('   3. You can safely delete local /uploads/gallery folder\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run migration
migrateGalleryImages();

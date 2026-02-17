/**
 * Migration Script: Upload Local Announcement Attachments to Supabase Storage
 * 
 * This script migrates announcement attachments from local /uploads/announcements folder
 * to Supabase Storage and updates the database with new URLs.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { announcements } = require('../src/database/connection');
const { uploadToSupabase } = require('../src/config/supabase');

// Path to local uploads folder
const UPLOADS_DIR = path.join(__dirname, '../uploads/announcements');

async function migrateAnnouncementAttachments() {
  console.log('🚀 Starting announcement attachments migration to Supabase...\n');

  try {
    // Get all announcements from database
    const announcementItems = await announcements.findAll();
    
    if (announcementItems.length === 0) {
      console.log('ℹ️  No announcements found in database.');
      return;
    }

    console.log(`📂 Found ${announcementItems.length} announcement(s) in database.\n`);

    let totalAttachmentsProcessed = 0;
    let totalUpdated = 0;

    // Process each announcement
    for (const item of announcementItems) {
      console.log(`\n📌 Processing Announcement #${item.id}: "${item.title}"`);
      
      let needsUpdate = false;
      const updatedAttachments = [];

      // Process attachments
      if (item.attachments && item.attachments.length > 0) {
        for (const attachment of item.attachments) {
          // Check if attachment URL is a local path (starts with /uploads)
          if (attachment.url && attachment.url.startsWith('/uploads')) {
            const localPath = path.join(__dirname, '..', attachment.url);
            
            // Check if file exists locally
            if (fs.existsSync(localPath)) {
              try {
                console.log(`  ⬆️  Uploading: ${attachment.originalName || attachment.filename}`);
                
                // Read file buffer
                const fileBuffer = fs.readFileSync(localPath);
                
                // Upload to Supabase
                const uploadResult = await uploadToSupabase(
                  fileBuffer,
                  attachment.originalName || attachment.filename,
                  'announcements',
                  attachment.fileType || 'image/jpeg'
                );
                
                // Update attachment object with Supabase URL
                updatedAttachments.push({
                  ...attachment,
                  url: uploadResult.url,
                  filename: uploadResult.path
                });
                
                console.log(`  ✅ Uploaded successfully: ${uploadResult.url}`);
                totalAttachmentsProcessed++;
                needsUpdate = true;
              } catch (error) {
                console.error(`  ❌ Error uploading ${attachment.filename}:`, error.message);
                // Keep original attachment data if upload fails
                updatedAttachments.push(attachment);
              }
            } else {
              console.log(`  ⚠️  File not found locally: ${localPath}`);
              // Keep original attachment data
              updatedAttachments.push(attachment);
            }
          } else {
            // Already uploaded to Supabase or external URL
            console.log(`  ℹ️  Skipping (already migrated): ${attachment.url}`);
            updatedAttachments.push(attachment);
          }
        }
      } else {
        console.log(`  ℹ️  No attachments for this announcement.`);
      }

      // Update database if any files were migrated
      if (needsUpdate) {
        try {
          await item.update({
            attachments: updatedAttachments
          });
          console.log(`  💾 Database updated for Announcement #${item.id}`);
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
    console.log(`   - Announcements processed: ${announcementItems.length}`);
    console.log(`   - Attachments migrated: ${totalAttachmentsProcessed}`);
    console.log(`   - Database records updated: ${totalUpdated}`);
    console.log(`${'='.repeat(60)}\n`);

    if (totalAttachmentsProcessed > 0) {
      console.log('🎉 Your announcement attachments are now in Supabase Storage!');
      console.log('📝 Next steps:');
      console.log('   1. Verify attachments appear correctly on your frontend');
      console.log('   2. Deploy updated backend to Vercel');
      console.log('   3. You can safely delete local /uploads/announcements folder\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run migration
migrateAnnouncementAttachments();

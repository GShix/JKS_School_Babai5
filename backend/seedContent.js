/**
 * Database Seeder for Content Management System
 * Run this script once to populate the database with initial content
 * 
 * Usage: node backend/seedContent.js
 */

require('dotenv').config();
const { contents } = require('./database/connection');

const seedContent = async () => {
  try {
    console.log('Starting content seeder...');

    const defaultContent = [
      // School Profile - Nepali Names
      { 
        section: 'school_profile', 
        key: 'schoolNameNepali', 
        value: 'श्री जनकल्याण', 
        language: 'ne', 
        valueType: 'text',
        category: 'identity',
        order: 1
      },
      { 
        section: 'school_profile', 
        key: 'schoolTypeNepali', 
        value: 'माध्यमिक विद्यालय:', 
        language: 'ne', 
        valueType: 'text',
        category: 'identity',
        order: 2
      },
      
      // School Profile - English
      { 
        section: 'school_profile', 
        key: 'schoolName', 
        value: 'Janakalyan Higher Secondary School', 
        language: 'en', 
        valueType: 'text',
        category: 'identity',
        order: 1
      },
      { 
        section: 'school_profile', 
        key: 'established', 
        value: '2045 B.S.', 
        language: 'en', 
        valueType: 'text',
        category: 'basic',
        order: 2
      },
      { 
        section: 'school_profile', 
        key: 'address', 
        value: 'Babai Rural Municipality-5, Padampur, Dang, Nepal', 
        language: 'en', 
        valueType: 'text',
        category: 'contact',
        order: 3
      },
      { 
        section: 'school_profile', 
        key: 'phone', 
        value: '+977-82-XXXXXX', 
        language: 'en', 
        valueType: 'text',
        category: 'contact',
        order: 4
      },
      { 
        section: 'school_profile', 
        key: 'email', 
        value: 'info@jkschool.edu.np', 
        language: 'en', 
        valueType: 'text',
        category: 'contact',
        order: 5
      },
      { 
        section: 'school_profile', 
        key: 'website', 
        value: 'www.jkschool.edu.np', 
        language: 'en', 
        valueType: 'text',
        category: 'contact',
        order: 6
      },
      { 
        section: 'school_profile', 
        key: 'principalName', 
        value: 'Principal Name', 
        language: 'en', 
        valueType: 'text',
        category: 'administration',
        order: 10
      },
      { 
        section: 'school_profile', 
        key: 'principalMessage', 
        value: 'Welcome to Janakalyan Higher Secondary School. We are committed to providing quality education and nurturing the holistic development of our students. Our dedicated faculty and modern facilities create an environment conducive to learning and growth.', 
        language: 'en', 
        valueType: 'text',
        category: 'administration',
        order: 11
      },
      { 
        section: 'school_profile', 
        key: 'principalImage', 
        value: '/img/principal.jpg', 
        language: 'en', 
        valueType: 'url',
        category: 'administration',
        order: 12
      },
      { 
        section: 'school_profile', 
        key: 'mission', 
        value: 'To provide quality education and develop well-rounded individuals who can contribute positively to society through academic excellence, character development, and practical skills.', 
        language: 'en', 
        valueType: 'text',
        category: 'vision-mission',
        order: 20
      },
      { 
        section: 'school_profile', 
        key: 'vision', 
        value: 'To be a leading educational institution in Nepal, known for academic excellence, holistic development, and producing responsible global citizens.', 
        language: 'en', 
        valueType: 'text',
        category: 'vision-mission',
        order: 21
      },
      { 
        section: 'school_profile', 
        key: 'facilities', 
        value: 'Science Laboratory, Computer Lab, Library, Sports Ground, Smart Classrooms, Playground, Canteen, Auditorium', 
        language: 'en', 
        valueType: 'text',
        category: 'infrastructure',
        order: 30
      },
      { 
        section: 'school_profile', 
        key: 'achievements', 
        value: '95% SEE Pass Rate 2080, District Science Fair Champions 2079, Best School Award 2078, 100% Grade 12 Pass Rate 2080', 
        language: 'en', 
        valueType: 'text',
        category: 'achievements',
        order: 31
      },
      { 
        section: 'school_profile', 
        key: 'aboutUsStory', 
        value: 'Janakalyan Higher Secondary School was established in 2045 B.S. with the mission to provide quality education to the students of Dang district. Over the years, we have grown from a small community school to a well-recognized educational institution, serving hundreds of students annually.', 
        language: 'en', 
        valueType: 'text',
        category: 'about',
        order: 40
      },
      { 
        section: 'school_profile', 
        key: 'aboutUsDescription', 
        value: 'We are committed to providing high-quality education that combines academic excellence with character development. Our experienced faculty, modern infrastructure, and student-centered approach create an environment where every student can thrive and reach their full potential.', 
        language: 'en', 
        valueType: 'text',
        category: 'about',
        order: 41
      },
      { 
        section: 'school_profile', 
        key: 'heroImage', 
        value: '/img/running-shield-blur.jpg', 
        language: 'en', 
        valueType: 'url',
        category: 'media',
        order: 50
      },
      { 
        section: 'school_profile', 
        key: 'logoUrl', 
        value: '/img/logo.png', 
        language: 'en', 
        valueType: 'url',
        category: 'media',
        order: 51
      },
      { 
        section: 'school_profile', 
        key: 'mapUrl', 
        value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.6370459737786!2d82.1354621!3d28.187951699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39981ddb63b5812f%3A0x459611dac3a9d5cc!2sJanakalyan%20H.S.S.%20Padampur!5e0!3m2!1sen!2snp!4v1757949161711!5m2!1sen!2snp', 
        language: 'en', 
        valueType: 'url',
        category: 'contact',
        order: 52
      },
      
      // Hero Section
      { 
        section: 'hero', 
        key: 'title', 
        value: 'Welcome to Janakalyan School', 
        language: 'en', 
        valueType: 'text',
        order: 1
      },
      { 
        section: 'hero', 
        key: 'subtitle', 
        value: 'Excellence in Education Since 2045 B.S.', 
        language: 'en', 
        valueType: 'text',
        order: 2
      },
      { 
        section: 'hero', 
        key: 'backgroundImage', 
        value: '/img/running-shield-blur.jpg', 
        language: 'en', 
        valueType: 'url',
        order: 3
      },
      { 
        section: 'hero', 
        key: 'ctaText', 
        value: 'Apply Now', 
        language: 'en', 
        valueType: 'text',
        order: 4
      },
      { 
        section: 'hero', 
        key: 'ctaLink', 
        value: '/admission', 
        language: 'en', 
        valueType: 'url',
        order: 5
      }
    ];

    let created = 0;
    let existing = 0;

    for (const item of defaultContent) {
      const [content, isNew] = await contents.findOrCreate({
        where: {
          section: item.section,
          key: item.key,
          language: item.language
        },
        defaults: {
          value: item.value,
          valueType: item.valueType,
          category: item.category,
          status: 'active',
          order: item.order
        }
      });

      if (isNew) {
        created++;
        console.log(`✓ Created: ${item.section}.${item.key} (${item.language})`);
      } else {
        existing++;
        console.log(`- Exists: ${item.section}.${item.key} (${item.language})`);
      }
    }

    console.log('\n=== Seeding Complete ===');
    console.log(`Created: ${created} items`);
    console.log(`Existing: ${existing} items`);
    console.log(`Total: ${created + existing} items`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding content:', error);
    process.exit(1);
  }
};

// Run seeder
seedContent();

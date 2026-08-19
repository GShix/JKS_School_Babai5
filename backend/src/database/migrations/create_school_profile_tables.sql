-- Create school_profile table
CREATE TABLE IF NOT EXISTS school_profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  school_name VARCHAR(255),
  school_name_nepali VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(100),
  address VARCHAR(255),
  address_nepali VARCHAR(255),
  province VARCHAR(100),
  district VARCHAR(100),
  municipality VARCHAR(100),
  ward VARCHAR(10),
  introduction TEXT,
  established VARCHAR(10),
  principal_name VARCHAR(255),
  website VARCHAR(255),
  facebook_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create school_messages table
CREATE TABLE IF NOT EXISTS school_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  person_name VARCHAR(255) NOT NULL,
  person_position VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  photo VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default school profile (optional - customize as needed)
INSERT INTO school_profile (
  school_name, 
  school_name_nepali, 
  phone, 
  email, 
  address, 
  address_nepali,
  province,
  district,
  municipality,
  ward,
  introduction,
  established,
  principal_name,
  facebook_url
) VALUES (
  'School Name',
  'श्री माध्यमिक विद्यालय',
  '+977 9800000000',
  'jksschoolp5@gmail.com',
  'Bhangabari, Dang',
  'बबई-५, बहङाबारी, दाङ',
  'Lumbini',
  'Dang',
  'Ghorahi',
  '5',
  'Welcome to our school! We are dedicated to providing a high-quality education to our students. Our experienced faculty and innovative curriculum ensure that every child reaches their full potential. We offer a wide range of extracurricular activities to foster creativity and personal growth. Our state-of-the-art facilities and supportive community create a nurturing environment for learning. Join us in shaping the future of our students and empowering them to become leaders in their communities.',
  '2005',
  'Mr. Principal Name',
  'https://www.facebook.com/janakalyana.ma.bi.padamapura.dana'
) ON DUPLICATE KEY UPDATE id=id;

-- Create indexes for better performance
CREATE INDEX idx_messages_active ON school_messages(is_active);
CREATE INDEX idx_messages_order ON school_messages(display_order);

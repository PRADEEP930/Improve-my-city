const pool = require('./database');

const initDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(50) DEFAULT 'citizen',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);

    // Create issues table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        user_id INTEGER REFERENCES users(id),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        address TEXT,
        photo_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default categories
    await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Potholes', 'Road damages and potholes'),
      ('Garbage', 'Waste management issues'),
      ('Street Lights', 'Non-functional street lights'),
      ('Water Supply', 'Water related issues'),
      ('Sewage', 'Drainage and sewage problems')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Database tables created successfully');
  } catch (err) {
    console.error('Error initializing database:', err);

        // Insert test user
    await pool.query(`
      INSERT INTO users (id, email, name, phone, user_type) 
      VALUES (1, 'test@city.com', 'Test User', '1234567890', 'citizen')
      ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      user_type = EXCLUDED.user_type
    `);

    console.log('✅ Test user created/updated successfully');
  }
};

module.exports = initDatabase;
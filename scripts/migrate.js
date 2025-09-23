import pool from '../config/database.js';

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Areas table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS areas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ingredients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recipes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT NOT NULL,
        thumb VARCHAR(500),
        time INTEGER,
        category_id INTEGER REFERENCES categories(id),
        area_id INTEGER REFERENCES areas(id),
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recipe ingredients junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
        measure VARCHAR(100) NOT NULL,
        UNIQUE(recipe_id, ingredient_id)
      )
    `);

    // User follows table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_follows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id),
        CHECK(follower_id != following_id)
      )
    `);

    // User favorite recipes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_favorite_recipes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, recipe_id)
      )
    `);

    // Testimonials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        testimonial TEXT NOT NULL,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category_id);
      CREATE INDEX IF NOT EXISTS idx_recipes_area ON recipes(area_id);
      CREATE INDEX IF NOT EXISTS idx_recipes_owner ON recipes(owner_id);
      CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
      CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
      CREATE INDEX IF NOT EXISTS idx_user_favorite_recipes_user ON user_favorite_recipes(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_favorite_recipes_recipe ON user_favorite_recipes(recipe_id);
    `);

    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

const dropTables = async () => {
  try {
    console.log('🔄 Dropping database tables...');
    
    const tables = [
      'user_favorite_recipes',
      'user_follows', 
      'recipe_ingredients',
      'recipes',
      'testimonials',
      'ingredients',
      'areas',
      'categories',
      'users'
    ];

    for (const table of tables) {
      await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }

    console.log('✅ Database tables dropped successfully!');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
};

// Run migration
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'drop') {
    dropTables()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    createTables()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

export { createTables, dropTables };

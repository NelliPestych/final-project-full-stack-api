import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const seedDatabase = async () => {
  try {
    console.log('🔄 Seeding database...');

    // Read JSON files
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../foodies/users.json'), 'utf8'));
    const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../foodies/categories.json'), 'utf8'));
    const areasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../foodies/areas.json'), 'utf8'));
    const ingredientsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../foodies/ingredients.json'), 'utf8'));
    const recipesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../foodies/recipes.json'), 'utf8'));
    const testimonialsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../foodies/testimonials.json'), 'utf8'));

    // Seed users
    console.log('📝 Seeding users...');
    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      // Use a simple counter for user IDs instead of converting ObjectId
      const userId = usersData.indexOf(user) + 1;
      await pool.query(
        'INSERT INTO users (id, name, email, password, avatar) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        [userId, user.name, user.email, hashedPassword, user.avatar]
      );
    }

    // Seed categories
    console.log('📝 Seeding categories...');
    for (const category of categoriesData) {
      const categoryId = categoriesData.indexOf(category) + 1;
      await pool.query(
        'INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [categoryId, category.name]
      );
    }

    // Seed areas
    console.log('📝 Seeding areas...');
    for (const area of areasData) {
      const areaId = areasData.indexOf(area) + 1;
      await pool.query(
        'INSERT INTO areas (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [areaId, area.name]
      );
    }

    // Seed ingredients
    console.log('📝 Seeding ingredients...');
    for (const ingredient of ingredientsData) {
      const ingredientId = ingredientsData.indexOf(ingredient) + 1;
      await pool.query(
        'INSERT INTO ingredients (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [ingredientId, ingredient.name]
      );
    }

    // Seed recipes
    console.log('📝 Seeding recipes...');
    for (const recipe of recipesData) {
      // Find category and area IDs
      const categoryResult = await pool.query('SELECT id FROM categories WHERE name = $1', [recipe.category]);
      const areaResult = await pool.query('SELECT id FROM areas WHERE name = $1', [recipe.area]);
      
      const categoryId = categoryResult.rows[0]?.id;
      const areaId = areaResult.rows[0]?.id;
      
      // Find correct owner by matching JSON user with recipe owner
      let ownerId = 1;
      if (recipe.owner && recipe.owner.$oid) {
        const recipeOwnerOid = recipe.owner.$oid;
        const userFromJson = usersData.find(u => u._id.$oid === recipeOwnerOid);
        if (userFromJson) {
          const dbUserResult = await pool.query('SELECT id FROM users WHERE name = $1', [userFromJson.name]);
          if (dbUserResult.rows.length > 0) {
            ownerId = dbUserResult.rows[0].id;
          }
        }
      }

      // Insert recipe
      const recipeId = recipesData.indexOf(recipe) + 1;
      const recipeResult = await pool.query(
        `INSERT INTO recipes (id, title, description, instructions, thumb, time, category_id, area_id, owner_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (id) DO NOTHING 
         RETURNING id`,
        [
          recipeId,
          recipe.title,
          recipe.description,
          recipe.instructions,
          recipe.thumb,
          parseInt(recipe.time) || 30,
          categoryId,
          areaId,
          ownerId
        ]
      );

      if (recipeResult.rows.length > 0) {
        // Insert recipe ingredients
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          for (const ingredient of recipe.ingredients) {
            // Find ingredient by name or use first ingredient
            const ingredientResult = await pool.query('SELECT id FROM ingredients WHERE name ILIKE $1 LIMIT 1', [`%${ingredient.id}%`]);
            const ingredientId = ingredientResult.rows[0]?.id || 1;
            await pool.query(
              'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, measure) VALUES ($1, $2, $3) ON CONFLICT (recipe_id, ingredient_id) DO NOTHING',
              [recipeId, ingredientId, ingredient.measure]
            );
          }
        }
      }
    }

    // Seed testimonials
    console.log('📝 Seeding testimonials...');
    for (const testimonial of testimonialsData) {
      const testimonialId = testimonialsData.indexOf(testimonial) + 1;
      
      // Find correct owner by matching JSON user with testimonial owner
      let ownerId = 1;
      if (testimonial.owner && testimonial.owner.$oid) {
        const testimonialOwnerOid = testimonial.owner.$oid;
        const userFromJson = usersData.find(u => u._id.$oid === testimonialOwnerOid);
        if (userFromJson) {
          const dbUserResult = await pool.query('SELECT id FROM users WHERE name = $1', [userFromJson.name]);
          if (dbUserResult.rows.length > 0) {
            ownerId = dbUserResult.rows[0].id;
          }
        }
      }
      
      await pool.query(
        'INSERT INTO testimonials (id, testimonial, owner_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
        [testimonialId, testimonial.testimonial, ownerId]
      );
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };

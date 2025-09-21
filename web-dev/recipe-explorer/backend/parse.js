const mysql = require('mysql2/promise');
const fs = require('fs').promises;
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

// const dbConfig = {
//   host: 'localhost',
//   user: 'root', 
//   password: '', 
//   database: 'securin'
// };

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS recipes (
    id INT(255) AUTO_INCREMENT PRIMARY KEY,
    cuisine VARCHAR(250) NOT NULL,
    title VARCHAR(250) NOT NULL,
    rating FLOAT,
    prep_time INT(255),
    cook_time INT(255),
    total_time INT(255),
    description TEXT,
    nutrients LONGTEXT,
    serves VARCHAR(500)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`;

async function main() {
  let connection;
  
  try {
    console.log('🚀 Starting recipe parser...');
    
    // Step 1: Connect to database
    console.log('📡 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Step 2: Create table if it doesn't exist
    console.log('🏗️  Creating/checking table...');
    await connection.execute(createTableSQL);
    console.log('✅ Table recipes is ready!');
    
    // Step 3: Read JSON file
    console.log('📖 Reading JSON file...');
    const jsonData = await fs.readFile('./US_recipes_null.json', 'utf8');
    const recipes = JSON.parse(jsonData);
    console.log(`📊 Found ${Object.keys(recipes).length} recipes to process`);
    
    // Debug: Check first recipe structure
    if (Object.keys(recipes).length > 0) {
      const firstRecipeKey = Object.keys(recipes)[0];
      const firstRecipe = recipes[firstRecipeKey];
      console.log('🔍 First recipe structure:', Object.keys(firstRecipe));
      console.log('🔍 Sample recipe data:', firstRecipe);
    }
    
    // Step 4: Insert recipes one by one
    console.log('💾 Inserting recipes into database...');
    let successCount = 0;
    let errorCount = 0;
    
    // Convert object with numbered keys to array
    const recipeArray = Object.values(recipes);
    console.log(`📊 Processing ${recipeArray.length} recipes from JSON...`);
    
    for (let i = 0; i < recipeArray.length; i++) {
      const recipe = recipeArray[i];
      
      try {
        // Extract data from recipe object based on actual JSON structure
        // Helper function to convert NaN to NULL
        const convertNaNToNull = (value) => {
          if (value === null || value === undefined || value === '') return null;
          if (typeof value === 'number' && isNaN(value)) return null;
          return value;
        };
        
        const recipeData = [
          recipe.cuisine || 'Unknown',
          recipe.title || 'Untitled Recipe',
          convertNaNToNull(recipe.rating),
          convertNaNToNull(recipe.prep_time),
          convertNaNToNull(recipe.cook_time),
          convertNaNToNull(recipe.total_time),
          recipe.description || '',
          JSON.stringify(recipe.nutrients) || '', // Convert nutrients object to JSON string
          recipe.serves || ''
        ];
        
        // Debug: Show first few recipes data
        if (i < 3) {
          console.log(`🔍 Recipe ${i + 1} data:`, recipeData);
        }
        
        // Insert into database (excluding id column since it's auto-increment)
        const insertSQL = `
          INSERT INTO recipes (
            cuisine, title, rating, prep_time, cook_time, 
            total_time, description, nutrients, serves
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await connection.execute(insertSQL, recipeData);
        successCount++;
        
        // Show progress every 100 recipes
        if (successCount % 100 === 0) {
          console.log(`✅ Inserted ${successCount} recipes so far...`);
        }
        
      } catch (error) {
        console.error(`❌ Error inserting recipe ${i + 1}:`, error.message);
        console.error(`   Recipe data:`, recipe);
        errorCount++;
      }
    }
    
    // Step 5: Show final results
    console.log('\n🎉 FINISHED!');
    console.log(`✅ Successfully inserted: ${successCount} recipes`);
    console.log(`❌ Errors: ${errorCount} recipes`);
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

main().catch(console.error);

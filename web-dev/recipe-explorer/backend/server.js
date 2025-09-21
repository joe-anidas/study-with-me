const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3301;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration using environment variables
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

// Create database connection pool
let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Helper to safely parse comparator strings like ">=4.5", "<=400", "300"
function parseComparator(raw) {
  if (raw === undefined || raw === null) return null;
  const str = String(raw).trim();
  const match = str.match(/^(<=|>=|=|<|>)?\s*(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const operator = match[1] || '=';
  const value = parseFloat(match[2]);
  return { operator, value };
}

// Get all recipes (paginated, sorted by rating DESC)
app.get('/api/recipes', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, parseInt(limit));
    const offset = (parsedPage - 1) * parsedLimit;

    // Count total
    const countQuery = 'SELECT COUNT(*) AS total FROM recipes';
    const [countRows] = await pool.execute(countQuery);
    const total = countRows[0]?.total || 0;

    // Fetch data sorted by rating DESC, then id ASC for deterministic order
    const dataQuery = `
      SELECT id, cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves
      FROM recipes
      ORDER BY rating DESC, id ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(dataQuery, [parsedLimit, offset]);

    // Map rows: parse nutrients JSON into object
    const data = rows.map((row) => {
      let nutrientsObj = null;
      if (row.nutrients) {
        try { nutrientsObj = JSON.parse(row.nutrients); } catch (_) { nutrientsObj = null; }
      }
      return {
        id: row.id,
        title: row.title,
        cuisine: row.cuisine,
        rating: row.rating,
        prep_time: row.prep_time,
        cook_time: row.cook_time,
        total_time: row.total_time,
        description: row.description,
        nutrients: nutrientsObj,
        serves: row.serves
      };
    });

    res.json({
      page: parsedPage,
      limit: parsedLimit,
      total,
      data
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search recipes endpoint (filters: calories, title, cuisine, total_time, rating)
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { calories, title, cuisine, total_time, rating, page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, parseInt(limit));
    const offset = (parsedPage - 1) * parsedLimit;

    // Build WHERE clause and params
    let where = 'WHERE 1=1';
    const params = [];

    if (title && String(title).trim()) {
      where += ' AND title LIKE ?';
      params.push(`%${String(title).trim()}%`);
    }

    if (cuisine && String(cuisine).trim()) {
      where += ' AND cuisine = ?';
      params.push(String(cuisine).trim());
    }

    // total_time comparator
    const totalTimeComp = parseComparator(total_time);
    if (totalTimeComp) {
      where += ` AND total_time ${totalTimeComp.operator} ?`;
      params.push(totalTimeComp.value);
    }

    // rating comparator
    const ratingComp = parseComparator(rating);
    if (ratingComp) {
      where += ` AND rating ${ratingComp.operator} ?`;
      params.push(ratingComp.value);
    }

    // calories comparator (extract numeric from nutrients JSON -> "389 kcal")
    const caloriesComp = parseComparator(calories);
    if (caloriesComp) {
      // Extract numeric calories from JSON string stored in LONGTEXT
      // MySQL: JSON_UNQUOTE(JSON_EXTRACT(nutrients,'$.calories')) -> '389 kcal'
      // Remove ' kcal' then CAST to DECIMAL
      const caloriesExpr = `CAST(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(nutrients, '$.calories')), ' kcal', '') AS DECIMAL(10,2))`;
      where += ` AND ${caloriesExpr} ${caloriesComp.operator} ?`;
      params.push(caloriesComp.value);
    }

    // Total count
    const countSql = `SELECT COUNT(*) AS total FROM recipes ${where}`;
    const [countRows] = await pool.execute(countSql, params);
    const total = countRows[0]?.total || 0;

    // Query data: prefer higher rating first, then id
    const dataSql = `
      SELECT id, cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves
      FROM recipes
      ${where}
      ORDER BY rating DESC, id ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(dataSql, [...params, parsedLimit, offset]);

    const data = rows.map((row) => {
      let nutrientsObj = null;
      if (row.nutrients) {
        try { nutrientsObj = JSON.parse(row.nutrients); } catch (_) { nutrientsObj = null; }
      }
      return {
        id: row.id,
        title: row.title,
        cuisine: row.cuisine,
        rating: row.rating,
        prep_time: row.prep_time,
        cook_time: row.cook_time,
        total_time: row.total_time,
        description: row.description,
        nutrients: nutrientsObj,
        serves: row.serves
      };
    });

    res.json({
      page: parsedPage,
      limit: parsedLimit,
      total,
      data
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// (Optional) Additional metadata endpoints can be added here if needed

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Recipes endpoint: http://localhost:${PORT}/api/recipes`);
    console.log(`Search endpoint: http://localhost:${PORT}/api/recipes/search`);
  });
}

startServer().catch(console.error);

# Recipe API Backend

RESTful API exposing recipe data stored in MySQL.

## Prerequisites
- Node.js 18+
- MySQL 8+

## 1) Database Setup

### Create database and table
Run the following SQL in MySQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS `securin`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE `securin`;

-- Recipes table (matches parse.js and API fields)
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` INT(255) AUTO_INCREMENT PRIMARY KEY,
  `cuisine` VARCHAR(250) NOT NULL,
  `title` VARCHAR(250) NOT NULL,
  `rating` FLOAT,
  `prep_time` INT(255),
  `cook_time` INT(255),
  `total_time` INT(255),
  `description` TEXT,
  `nutrients` LONGTEXT,   -- JSON string, e.g. {"calories":"389 kcal", ...}
  `serves` VARCHAR(500),
  INDEX `idx_title` (`title`),
  INDEX `idx_cuisine` (`cuisine`),
  INDEX `idx_rating` (`rating`),
  INDEX `idx_total_time` (`total_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### Load data (script)
This project includes a loader script that creates the table if needed and imports the JSON data.

1) Place `US_recipes_null.json` in `backend/` (already included in this repo).

2) Configure MySQL credentials in `server.js` and `parse.js` if needed:

```js
// server.js / parse.js
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'securin'
};
```

3) Install dependencies and run the loader:

```bash
cd backend
npm install
node parse.js
```

The script will:
- Ensure the `recipes` table exists
- Read `US_recipes_null.json`
- Insert all recipes

## 2) Run the API server

```bash
cd backend
npm install
npm start
```

Server listens on `http://localhost:3001` by default.

## 3) API Endpoints

### Health
GET `/api/health`

Response:
```json
{ "status": "OK", "timestamp": "2024-01-15T10:30:00.000Z" }
```

### Get All Recipes (paginated, sorted by rating desc)
GET `/api/recipes`

Query params:
- `page` (number, default 1)
- `limit` (number, default 10)

Example:
```bash
curl "http://localhost:3001/api/recipes?page=1&limit=10"
```

Sample response:
```json
{
  "page": 1,
  "limit": 10,
  "total": 50,
  "data": [
    {
      "id": 1,
      "title": "Sweet Potato Pie",
      "cuisine": "Southern Recipes",
      "rating": 4.8,
      "prep_time": 15,
      "cook_time": 100,
      "total_time": 115,
      "description": "Shared from a Southern recipe, this homemade sweet potato pie...",
      "nutrients": {
        "calories": "389 kcal",
        "carbohydrateContent": "48 g",
        "cholesterolContent": "78 mg",
        "fiberContent": "3 g",
        "proteinContent": "5 g",
        "saturated FatContent": "10 g",
        "sodiumContent": "254 mg",
        "sugarContent": "28 g",
        "fatContent": "21 g"
      },
      "serves": "8 servings"
    }
  ]
}
```

### Search Recipes (field-level filters)
GET `/api/recipes/search`

Query params (all optional):
- `title`: partial match on title
- `cuisine`: exact match on cuisine
- `rating`: comparator format, e.g. `>=4.5`, `<=3`, `=5`
- `total_time`: comparator format, e.g. `<=60`, `>120`
- `calories`: comparator format on numeric calories parsed from `nutrients.calories` (e.g. `<=400`)
- `page` (number, default 1)
- `limit` (number, default 10)

Examples:
```bash
curl "http://localhost:3001/api/recipes/search?title=pie&rating=>=4.5&calories=<=400&limit=15"

curl "http://localhost:3001/api/recipes/search?cuisine=Southern%20Recipes&total_time=<=60&page=2&limit=20"
```

Sample response:
```json
{
  "page": 1,
  "limit": 15,
  "total": 3,
  "data": [
    {
      "id": 1,
      "title": "Sweet Potato Pie",
      "cuisine": "Southern Recipes",
      "rating": 4.8,
      "prep_time": 15,
      "cook_time": 100,
      "total_time": 115,
      "description": "Shared from a Southern recipe, this homemade sweet potato pie...",
      "nutrients": {
        "calories": "389 kcal",
        "carbohydrateContent": "48 g",
        "cholesterolContent": "78 mg",
        "fiberContent": "3 g",
        "proteinContent": "5 g",
        "saturated FatContent": "10 g",
        "sodiumContent": "254 mg",
        "sugarContent": "28 g",
        "fatContent": "21 g"
      },
      "serves": "8 servings"
    }
  ]
}
```

Notes:
- Calories are extracted from `nutrients.calories` like "389 kcal" using SQL (`JSON_EXTRACT` + `REPLACE` + `CAST`).
- Results are ordered by `rating DESC, id ASC`.

## 4) API Testing Tips

### cURL
```bash
# Health
curl http://localhost:3001/api/health

# Page 1, 15 results per page
curl "http://localhost:3001/api/recipes?page=1&limit=15"

# Search by title and rating
curl "http://localhost:3001/api/recipes/search?title=pie&rating=>=4.5"

# Search by cuisine and total time
curl "http://localhost:3001/api/recipes/search?cuisine=Southern%20Recipes&total_time=<=60"

# Search by calories
curl "http://localhost:3001/api/recipes/search?calories=<=400"
```

### Postman / REST Client
- Import a new collection and add the above endpoints
- Set `page`/`limit` as query params
- Try comparator filters: `>=`, `<=`, `<`, `>`, `=`

## Error Handling
- `400`: Invalid parameters (if present in future validation)
- `500`: Internal server error

Error body:
```json
{ "error": "Internal server error" }
```

## CORS
This API enables CORS for use by the frontend.

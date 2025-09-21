# Recipe API Backend

This backend provides RESTful API endpoints for managing recipes from the MySQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update database configuration in `server.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'securin'
};
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on port 3001 by default.

## API Endpoints

### 1. Get All Recipes (Paginated & Sorted)
**GET** `/api/recipes`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of recipes per page (default: 10)
- `sortBy` (optional): Field to sort by (default: 'id')
  - Valid values: `id`, `name`, `category`, `difficulty`, `cook_time`, `created_at`
- `sortOrder` (optional): Sort order (default: 'ASC')
  - Valid values: `ASC`, `DESC`
- `category` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty

**Example:**
```
GET /api/recipes?page=1&limit=5&sortBy=name&sortOrder=ASC&category=Dessert
```

**Response:**
```json
{
  "recipes": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecipes": 50,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 5
  },
  "sorting": {
    "sortBy": "name",
    "sortOrder": "ASC"
  }
}
```

### 2. Search Recipes
**GET** `/api/recipes/search`

**Query Parameters:**
- `query` (optional): Text search across name, description, instructions, and category
- `category` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty
- `minCookTime` (optional): Minimum cook time in minutes
- `maxCookTime` (optional): Maximum cook time in minutes
- `ingredients` (optional): Search for specific ingredients
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of recipes per page (default: 10)

**Example:**
```
GET /api/recipes/search?query=chicken&category=Main&minCookTime=30&maxCookTime=60
```

**Response:**
```json
{
  "recipes": [...],
  "searchQuery": "chicken",
  "filters": {
    "category": "Main",
    "minCookTime": "30",
    "maxCookTime": "60"
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecipes": 25,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 10
  }
}
```

### 3. Get Recipe Categories
**GET** `/api/recipes/categories`

Returns a list of all available recipe categories for filtering.

**Response:**
```json
["Appetizer", "Main", "Dessert", "Breakfast", "Lunch", "Dinner"]
```

### 4. Get Recipe Difficulties
**GET** `/api/recipes/difficulties`

Returns a list of all available recipe difficulties for filtering.

**Response:**
```json
["Easy", "Medium", "Hard"]
```

### 5. Health Check
**GET** `/api/health`

Returns server status and timestamp.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Database Schema

The API expects a `recipes` table with the following structure:
```sql
CREATE TABLE recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients TEXT,
  instructions TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(50),
  cook_time INT, -- in minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `500`: Internal Server Error

Error responses include an `error` field with a descriptive message.

## CORS

The API includes CORS middleware to allow cross-origin requests from your frontend application.

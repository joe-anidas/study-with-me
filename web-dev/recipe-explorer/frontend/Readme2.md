# Recipe Explorer Frontend

React app that consumes the Recipe API with a data table, column-level filters, pagination, and a right-side drawer for details.

## Features

- **Table columns**: Title (truncated), Cuisine, Star Rating, Total Time, Serves
- **Drawer**: Shows Title and Cuisine header, Description, Total Time with expandable Prep/Cook times, and a Nutrition section
- **Filters**: Field-level filters for Title, Cuisine, Rating, Total Time, Calories; Apply/Clear behavior
- **Pagination**: 15–50 results per page, with page indicators
- **Fallbacks**: Error banner with Retry; filtered no-results triggers alert + auto-clear

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:3001`

### Install and Run
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Configuration

- `src/config.js`:
  - `API_BASE_URL` (default: `http://localhost:3001/api`)
  - `DEFAULT_PAGE_SIZE` = 15
  - `PAGE_SIZE_OPTIONS` = [15, 20, 30, 40, 50]

## API Usage From UI

- List: `GET /api/recipes?page=1&limit=15` → `{ page, limit, total, data }`
- Search: `GET /api/recipes/search?title=pie&rating=>=4.5&total_time=<=60&calories=<=400` → same shape

The UI only calls `/search` when a filter field is non-empty. Otherwise it calls `/recipes`.

## Testing the UI

1) Start the backend (`npm start` in `backend/`) and the frontend (`npm run dev` in `frontend/`).
2) In the UI:
   - Enter filters (e.g., Title: `pie`, Rating: `>=4.5`, Calories: `<=400`) and click Apply.
   - Click a row to open the drawer and inspect details.
   - Change results per page to 20, 30, 40, or 50.
3) If no results with filters, an alert will show and filters auto-clear.

## Sample API Requests (for debugging)

```bash
# All recipes (first page, 15 per page)
curl "http://localhost:3001/api/recipes?page=1&limit=15"

# Search by title and rating
curl "http://localhost:3001/api/recipes/search?title=pie&rating=>=4.5"

# Search by cuisine and total time
curl "http://localhost:3001/api/recipes/search?cuisine=Southern%20Recipes&total_time=<=60"

# Search by calories
curl "http://localhost:3001/api/recipes/search?calories=<=400"
```

## Data Shape Expected by UI

Each recipe in `data`:
```json
{
  "id": 1,
  "title": "Sweet Potato Pie",
  "cuisine": "Southern Recipes",
  "rating": 4.8,
  "prep_time": 15,
  "cook_time": 100,
  "total_time": 115,
  "description": "...",
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
```

## Notes

- Star rating is rendered with CSS-based stars.
- Filters apply only when clicking Apply; Clear resets filters and reloads page 1.

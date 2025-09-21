# Recipe Explorer Frontend

A modern React application for browsing and searching recipes with advanced filtering, pagination, and detailed recipe views.

## Features

### 🍽️ **Recipe Table**
- **Title Column**: Displays recipe name with truncated description below
- **Cuisine Column**: Shows recipe category with styled badges
- **Rating Column**: 5-star rating system with visual stars
- **Total Time Column**: Displays cook time with clock icon
- **Serves Column**: Shows number of people served with users icon

### 🔍 **Advanced Search & Filtering**
- **Text Search**: Search across recipe names, descriptions, instructions, and categories
- **Category Filter**: Filter by recipe categories (populated from API)
- **Difficulty Filter**: Filter by recipe difficulty levels
- **Cook Time Range**: Filter by minimum and maximum cook times
- **Ingredients Search**: Search for specific ingredients

### 📄 **Pagination & Results Control**
- **Customizable Results**: Choose from 15, 25, or 50 results per page
- **Smart Pagination**: Navigate through pages with Previous/Next buttons
- **Page Indicators**: Shows current page and total pages
- **Results Counter**: Displays current range and total results

### 📱 **Recipe Detail View**
- **Right-Side Drawer**: Slides in from the right when clicking a recipe row
- **Recipe Header**: Title and cuisine category prominently displayed
- **Detailed Information**: Description, ingredients, and instructions
- **Time Breakdown**: Expandable view showing prep time and cook time
- **Nutrition Table**: Comprehensive nutrition information in organized format

### 🎨 **User Experience Features**
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Spinner and loading messages during API calls
- **Error Handling**: User-friendly error messages with retry options
- **Empty States**: Helpful messages when no recipes or results are found
- **Hover Effects**: Interactive table rows with hover states

## Technical Implementation

### **Architecture**
- **React 19**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Custom Icons**: SVG-based icon system for consistency
- **State Management**: React hooks for local state management
- **API Integration**: RESTful API calls to backend service

### **Key Components**
- **App.jsx**: Main application component with table and drawer
- **Icons.jsx**: Custom SVG icon components
- **config.js**: Configuration constants and API settings

### **API Integration**
- **Base URL**: Configurable API endpoint (default: `http://localhost:3001/api`)
- **Endpoints Used**:
  - `GET /api/recipes` - Fetch paginated recipes
  - `GET /api/recipes/search` - Search recipes with filters
  - `GET /api/recipes/categories` - Get available categories
  - `GET /api/recipes/difficulties` - Get available difficulties

## Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- Backend API running on port 3001
- MySQL database with recipes table

### **Installation**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

### **Build for Production**
```bash
npm run build
```

## Configuration

### **API Settings**
Update `src/config.js` to change:
- API base URL
- Default page size
- Available page size options
- Table column labels

### **Styling**
Customize the appearance by modifying:
- `src/index.css` - Global styles and Tailwind components
- `tailwind.config.js` - Tailwind configuration and custom colors

## Database Schema

The frontend expects recipes with the following structure:
```javascript
{
  id: number,
  name: string,
  description: string,
  ingredients: string,
  instructions: string,
  category: string,
  difficulty: string,
  cook_time: number,
  prep_time: number,
  serves: number,
  rating: number,
  calories: number,
  proteinContent: string,
  carbohydrateContent: string,
  fatContent: string,
  fiberContent: string,
  sugarContent: string,
  sodiumContent: string,
  cholesterolContent: string,
  saturatedFatContent: string
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- **Lazy Loading**: Only loads visible recipes
- **Efficient Pagination**: Minimal API calls
- **Optimized Rendering**: React key props for list optimization
- **Responsive Images**: Optimized for different screen sizes

## Future Enhancements

- **Recipe Favorites**: Save and manage favorite recipes
- **Advanced Sorting**: Sort by multiple columns
- **Recipe Sharing**: Share recipes via social media
- **Offline Support**: Service worker for offline access
- **Dark Mode**: Toggle between light and dark themes

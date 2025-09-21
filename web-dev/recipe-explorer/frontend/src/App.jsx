import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from './config';
import './index.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTimeBreakdown, setShowTimeBreakdown] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(DEFAULT_PAGE_SIZE);

  // Column filters (field/cell level)
  const [filters, setFilters] = useState({
    title: '',
    cuisine: '',
    rating: '',        // supports formats like ">=4.5", "<=3"
    total_time: '',    // supports formats like "<=60", ">120"
    calories: ''       // optional extra filter
  });

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((v) => String(v || '').trim() !== '');
  }, [filters]);

  // Fetch: list or search depending on filters
  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const baseParams = new URLSearchParams({
        page: String(page),
        limit: String(resultsPerPage)
      });

      let url = `${API_BASE_URL}/recipes`;
      if (hasActiveFilters()) {
        // Apply only non-empty filters to query string
        const searchParams = new URLSearchParams();
        baseParams.forEach((value, key) => searchParams.set(key, value));
        Object.entries(filters).forEach(([k, v]) => {
          if (String(v || '').trim() !== '') searchParams.set(k, String(v).trim());
        });
        url = `${API_BASE_URL}/recipes/search?${searchParams.toString()}`;
      } else {
        url = `${url}?${baseParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the backend is running.');
        }
        throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const list = json.data || [];
      const total = json.total ?? 0;
      const pageNum = json.page ?? page;
      const limitNum = json.limit ?? resultsPerPage;

      setRecipes(list);
      setTotalRecipes(total);
      setCurrentPage(Number(pageNum));
      setTotalPages(Math.max(1, Math.ceil(Number(total) / Number(limitNum))));
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
      setRecipes([]);
      setTotalRecipes(0);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [resultsPerPage, filters, hasActiveFilters]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchData(1);
  };

  const clearFilters = () => {
    setFilters({ title: '', cuisine: '', rating: '', total_time: '', calories: '' });
    setCurrentPage(1);
    fetchData(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchData(page);
  };

  const handleResultsPerPageChange = (newLimit) => {
    setResultsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleRowClick = (recipe) => {
    setSelectedRecipe(recipe);
    setDrawerOpen(true);
    setShowTimeBreakdown(false);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRecipe(null);
  };

  // Effects
  useEffect(() => {
    // Load data on mount and when resultsPerPage changes.
    // Filters are applied only when user clicks Apply.
    fetchData(1);
  }, [resultsPerPage]);

  // If filters are applied and no results, alert and auto-clear filters
  useEffect(() => {
    if (!loading && recipes.length === 0 && !error && hasActiveFilters()) {
      clearFilters();
    }
  }, [loading, recipes, error, hasActiveFilters]);

  // Utils
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderStars = (rating) => {
    const safe = Math.max(0, Math.min(5, Number(rating) || 0));
    const width = `${(safe / 5) * 100}%`;
    return (
      <div className="stars" aria-label={`${safe} out of 5`}>
        <div className="stars-outer">
          <div className="stars-inner" style={{ width }} />
        </div>
      </div>
    );
  };

  const renderTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    const total = Number(minutes) || 0;
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getNutrient = (nutrients, key) => {
    if (!nutrients) return 'N/A';
    if (key in nutrients) return nutrients[key] || 'N/A';
    // handle odd key for saturated fat
    if (key === 'saturatedFatContent' && 'saturated FatContent' in nutrients) {
      return nutrients['saturated FatContent'] || 'N/A';
    }
    return 'N/A';
  };

  // Removed full-screen no-results fallback; handled via alert + auto-clear above

  // Error fallback
  if (error && !error.includes('API endpoint not found') && !error.includes('Failed to fetch')) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2 className="error-title">Something went wrong</h2>
          <p className="error-text">{error}</p>
          <button onClick={() => fetchData(1)} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="header-title">Recipe Explorer</h1>
            <div className="header-info">
              <span className="total-recipes">Total: {totalRecipes} recipes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Column-level Filters */}
      <div className="search-section">
        <div className="search-content">
          <div className="filters-grid">
            <div className="filter-field">
              <label className="filter-label">Title</label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                placeholder="e.g., pie"
                className="search-input"
              />
            </div>
            <div className="filter-field">
              <label className="filter-label">Cuisine</label>
              <input
                type="text"
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                placeholder="e.g., Southern Recipes"
                className="search-input"
              />
            </div>
            <div className="filter-field">
              <label className="filter-label">Rating</label>
              <input
                type="text"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                placeholder=">=4.5"
                className="search-input"
              />
            </div>
            <div className="filter-field">
              <label className="filter-label">Total Time (min)</label>
              <input
                type="text"
                value={filters.total_time}
                onChange={(e) => handleFilterChange('total_time', e.target.value)}
                placeholder="<=60"
                className="search-input"
              />
            </div>
            <div className="filter-field">
              <label className="filter-label">Calories</label>
              <input
                type="text"
                value={filters.calories}
                onChange={(e) => handleFilterChange('calories', e.target.value)}
                placeholder="<=400"
                className="search-input"
              />
            </div>
            <div className="filter-actions">
              <button onClick={applyFilters} className="btn-primary">Apply</button>
              <button onClick={clearFilters} className="btn-secondary">Clear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <div className="error-banner-content">
              <div className="error-banner-text">
                <h3 className="error-banner-title">Connection Error</h3>
                <p className="error-banner-message">{error}</p>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  fetchData(1);
                }}
                className="error-banner-button"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Results Per Page */}
        <div className="results-controls">
          <div className="results-per-page">
            <span className="results-label">Results per page:</span>
            <select
              value={resultsPerPage}
              onChange={(e) => handleResultsPerPageChange(parseInt(e.target.value))}
              className="results-select"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <div className="results-info">
            Showing {((currentPage - 1) * resultsPerPage) + 1} to {Math.min(currentPage * resultsPerPage, totalRecipes)} of {totalRecipes} results
          </div>
        </div>

        {/* Recipes Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="recipes-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Title</th>
                  <th className="table-header-cell">Cuisine</th>
                  <th className="table-header-cell">Rating</th>
                  <th className="table-header-cell">Total Time</th>
                  <th className="table-header-cell">Serves</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="loading-cell">
                      <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <span className="loading-text">Loading recipes...</span>
                      </div>
                    </td>
                  </tr>
                ) : recipes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-recipes-cell">
                      <div className="no-recipes-content">
                        <h3 className="no-recipes-title">No recipes found</h3>
                        <p className="no-recipes-message">Try adjusting your search criteria or filters</p>
                        <button 
                          onClick={() => {
                            clearFilters();
                          }}
                          className="btn-clear"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recipes.map((recipe) => (
                    <tr 
                      key={recipe.id} 
                      className="table-row"
                      onClick={() => handleRowClick(recipe)}
                    >
                      <td className="table-cell">
                        <div className="recipe-info">
                          <div className="recipe-name">
                            {truncateText(recipe.title, 40)}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="category-badge">{recipe.cuisine || 'N/A'}</span>
                      </td>
                      <td className="table-cell">
                        {renderStars(recipe.rating)}
                      </td>
                      <td className="table-cell">
                        {renderTime(recipe.total_time)}
                      </td>
                      <td className="table-cell">
                        {recipe.serves || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={page === currentPage
                      ? "pagination-button active"
                      : "pagination-button"
                    }
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
            
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Detail Drawer */}
      {selectedRecipe && (
        <div className={`drawer ${drawerOpen ? "drawer-open" : "drawer-closed"}`}>
          <div className="drawer-content">
            {/* Drawer Header */}
            <div className="drawer-header">
              <div className="drawer-header-content">
                <div className="drawer-title-section">
                  <h2 className="drawer-title">
                    {selectedRecipe.title}
                  </h2>
                  <span className="drawer-category">
                    {selectedRecipe.cuisine || 'N/A'}
                  </span>
                </div>
                <button
                  onClick={closeDrawer}
                  className="drawer-close-button"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="drawer-body">
              {/* Description */}
              {selectedRecipe.description && (
                <div className="drawer-section">
                  <h3 className="drawer-section-title">Description</h3>
                  <p className="drawer-section-text">{selectedRecipe.description}</p>
                </div>
              )}

              {/* Total Time with Expandable Details */}
              <div className="drawer-section">
                <h3 className="drawer-section-title">Total Time</h3>
                <div className="time-display">
                  <span className="time-value">
                    {renderTime(selectedRecipe.total_time)}
                  </span>
                  {(selectedRecipe.prep_time || selectedRecipe.cook_time) && (
                    <button
                      className="time-details-button"
                      onClick={() => setShowTimeBreakdown((v) => !v)}
                    >
                      {showTimeBreakdown ? 'Hide Details' : 'Show Details'}
                    </button>
                  )}
                </div>
                {showTimeBreakdown && (
                  <div className="time-breakdown">
                    {selectedRecipe.prep_time && (
                      <div>Prep Time: {renderTime(selectedRecipe.prep_time)}</div>
                    )}
                    {selectedRecipe.cook_time && (
                      <div>Cook Time: {renderTime(selectedRecipe.cook_time)}</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Nutrition Information */}
              <div className="drawer-section">
                <h3 className="drawer-section-title">Nutrition Information</h3>
                <div className="drawer-content-box">
                  <div className="nutrition-grid">
                    <div className="nutrition-item"><span className="nutrition-label">Calories:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'calories')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">carbohydrateContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'carbohydrateContent')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">cholesterolContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'cholesterolContent')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">fiberContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'fiberContent')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">proteinContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'proteinContent')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">saturated FatContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'saturatedFatContent')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">sodiumContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'sodiumContent')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">sugarContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'sugarContent')}</span></div>
                    <div className="nutrition-item"><span className="nutrition-label">fatContent:</span><span className="nutrition-value">{getNutrient(selectedRecipe.nutrients, 'fatContent')}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="drawer-overlay"
          onClick={closeDrawer}
        />
      )}
    </div>
  );
}

export default App;

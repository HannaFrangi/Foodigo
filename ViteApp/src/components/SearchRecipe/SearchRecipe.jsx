import React, { useState } from "react";
import { Search, ChefHat, Sparkles, Sparkle } from "lucide-react";

const SearchHeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Sample data
  const sampleRecipes = [
    {
      id: 1,
      strMeal: "Mediterranean Salad",
      strCategory: "Vegetarian",
      strMealThumb: "/api/placeholder/300/200",
    },
    {
      id: 2,
      strMeal: "Grilled Salmon",
      strCategory: "Seafood",
      strMealThumb: "/api/placeholder/300/200",
    },
    {
      id: 3,
      strMeal: "Avocado Toast",
      strCategory: "Breakfast",
      strMealThumb: "/api/placeholder/300/200",
    },
  ];

  const getTagColors = (category) => {
    switch (category) {
      case "Vegetarian":
        return "bg-[#F0F5C4] text-[#59871f]";
      case "Breakfast":
        return "bg-[#EFEDFA] text-[#3C3A8F]";
      case "Seafood":
        return "bg-[#E8F5FA] text-[#397A9E]";
      default:
        return "bg-[#FFE5E5] text-[#FF4646]";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    // Simulate search based on query
    setTimeout(() => {
      const filteredRecipes = searchQuery.toLowerCase()
        ? sampleRecipes.filter((recipe) =>
            recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : sampleRecipes;
      setRecipes(filteredRecipes);
      setIsLoading(false);
    }, 1000);
  };

  const FloatingElement = ({ className }) => (
    <div className={`absolute animate-float opacity-20 ${className}`}>
      <ChefHat className="w-8 h-8 text-[#606848]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-transparent py-32">
        <div className="absolute inset-0 overflow-hidden">
          <FloatingElement className="top-1/4 left-1/4" />
          <FloatingElement className="top-3/4 left-1/3" />
          <FloatingElement className="top-1/3 right-1/4" />
          <FloatingElement className="bottom-1/4 right-1/3" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="animate-bounce-slow">
                <Sparkles className="w-12 h-12 text-[#606848]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#606848] sm:text-5xl md:text-6xl animate-fade-in">
              Je3na ya zalme
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-[#7A845E] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-delayed">
              3mel shi
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="relative z-10 block w-full pl-10 pr-3 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#606848] focus:ring-2 focus:ring-[#606848] focus:ring-opacity-50 transition-all duration-300"
                  placeholder='Try something like "salad" or "beef"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#606848] via-[#7A845E] to-[#606848] rounded-xl transition-all duration-300 animate-gradient-x blur-md opacity-20"></div>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 transition-colors duration-300 text-[#606848] z-20" />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-[#606848] text-white rounded-xl hover:bg-[#4A5139] transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search Recipes"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-white rounded-3xl shadow-sm"
                  >
                    <div className="h-48 bg-gray-200 rounded-3xl mb-6"></div>
                    <div className="px-4 pb-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded-full w-1/2"></div>
                    </div>
                  </div>
                ))
            : recipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="max-w-xs transition-all duration-300 lg:max-w-[22rem] shadow-sm mx-auto sm:mx-0 border bg-white rounded-3xl hover:shadow-md cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    <img
                      className="rounded-3xl w-full h-48 object-cover"
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                    />
                  </div>
                  <div className="px-4 pb-6">
                    <h2 className="mb-1 text-[#2C2C2C] text-xl lg:text-2xl tracking-tight font-normal">
                      {recipe.strMeal}
                    </h2>
                    <div className="flex gap-2 my-6 items-center">
                      <span
                        className={`${getTagColors(
                          recipe.strCategory
                        )} mr-auto py-3 px-6 rounded-full uppercase tracking-widest text-xs font-semibold`}
                      >
                        {recipe.strCategory}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!isLoading && hasSearched && recipes.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <ChefHat className="mx-auto h-12 w-12 text-[#606848] mb-4" />
            <h3 className="text-lg font-medium text-[#606848]">
              No recipes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or browse our categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeroSection;

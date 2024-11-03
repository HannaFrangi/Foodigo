import { useState } from "react";
import { Search, Sparkles, ChefHat, Loader } from "lucide-react";
import { useRecipeStore } from "../../store/useRecipeStore";
import RecipeResults from "../../components/RecipeCard/RecipeResults";
import { Spinner } from "@radix-ui/themes";
import { Spin } from "antd";
import { CircularProgress } from "@mui/material";

const SearchHeroSection = () => {
  const { searchQuery, setSearchQuery, searchRecipes, hasSearched, Searching } =
    useRecipeStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    searchRecipes(searchQuery);
  };

  const FloatingElement = ({ className }) => (
    <div className={`absolute animate-float opacity-20 ${className}`}>
      <ChefHat className="w-8 h-8 text-[#606848]" />
    </div>
  );

  return (
    <div className={`bg-transparent ${hasSearched ? "" : ""}`}>
      <div className="relative overflow-hidden bg-transparent py-16">
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
            <h1
              className={`text-4xl font-bold tracking-tight text-[#606848] sm:text-5xl ${
                hasSearched ? "md:text-5xl" : "md:text-6xl"
              } animate-fade-in`}
            >
              Je3na ya zalme
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-[#7A845E] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-delayed">
              3mel shi
            </p>

            <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="relative z-10 block w-full pl-10 pr-3 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#606848] focus:ring-2 focus:ring-[#606848] focus:ring-opacity-50 transition-all duration-300"
                  placeholder='Try something like "salad" or "beef"'
                  value={searchQuery}
                  disabled={Searching}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#606848] via-[#7A845E] to-[#606848] rounded-xl transition-all duration-300 animate-gradient-x blur-md opacity-20" />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 transition-colors duration-300 text-[#606848] z-20" />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-[#606848] text-white rounded-xl hover:bg-[#4A5139] transition-colors duration-300"
              >
                {Searching ? (
                  <CircularProgress
                    variant="indeterminate"
                    size={30}
                    sx={(theme) => ({ color: "white" })}
                  />
                ) : (
                  "Search Recipes"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {hasSearched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <RecipeResults />
        </div>
      )}
    </div>
  );
};

export default SearchHeroSection;

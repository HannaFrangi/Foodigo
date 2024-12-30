import React, { useEffect, useState, useRef } from "react";
import { Button, Select } from "antd";
import { Input } from "@nextui-org/react";
import {
  Search,
  ChefHat,
  Soup,
  BookOpen,
  Sparkles,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGetRandomRecipe from "/src/hooks/useGetRandomRecipe";
import RecipeCard from "/src/components/RecipeCard/RecipeCard";
import { useRecipeStore } from "/src/store/useRecipeStore";
import toast from "react-hot-toast";
import RecipeResults from "/src/components/RecipeCard/RecipeResults";
import useGetRecipeByIngrediants from "/src/hooks/useGetRecipeByIngrediants";

const { Option } = Select;

const LoadingSpinner = () => <Loader className="w-4 h-4 animate-spin" />;

const SearchCard = ({ icon: Icon, title, children, className = "" }) => (
  <div
    className={`${className} bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 sm:p-3 bg-olive/10 rounded-xl">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-olive" />
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
        {title}
      </h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function RecipePage() {
  const [ingredient, setIngredient] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [CATEGORIES, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [ingredientLoading, setIngredientLoading] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    searchRecipes,
    hasSearched,
    Searching,
    SearchResults,
    error,
  } = useRecipeStore();

  const {
    loading,
    error: ingredientError,
    recipe,
    getRecipeByIngrediants,
  } = useGetRecipeByIngrediants();

  const resultsRef = useRef(null);

  const scrollToResults = () => {
    // Add a small delay to ensure the results are rendered
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const {
    getRandomRecipe,
    loading: randomLoading,
    error: randomError,
  } = useGetRandomRecipe();

  const handleRandomClick = async () => {
    try {
      const recipe = await getRandomRecipe();
      if (recipe) {
        navigate(`/recipe/${recipe._id}`);
      }
    } catch (error) {
      toast.error("Failed to get random recipe. Please try again.");
    }
  };

  const handleRecipeSearch = async (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9\s]*$/;

    if (searchQuery.length < 3) {
      toast.error("Please enter at least 3 characters to search", {
        duration: 1500,
      });
      return;
    }

    if (!regex.test(searchQuery)) {
      toast.error("Please avoid special characters in your search", {
        duration: 1000,
      });
      return;
    }

    try {
      await searchRecipes(searchQuery);
      scrollToResults();
    } catch (error) {
      toast.error("Search failed. Please try again.");
    }
  };

  const handleCategorySearch = async () => {
    if (!category) {
      toast.error("Please select a category first", {
        duration: 1500,
      });
      return;
    }

    setCategoryLoading(true);
    try {
      // Implement category search logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Placeholder for API call
      scrollToResults();
    } catch (error) {
      toast.error("Category search failed. Please try again.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleIngredientSearch = async () => {
    if (ingredient.length < 3) {
      toast.error("Please enter at least 3 characters to search", {
        duration: 1500,
      });
      return;
    }

    setIngredientLoading(true);
    try {
      const response = await getRecipeByIngrediants(ingredient);

      // Check if response exists and handle accordingly

      // If successful, scroll to results
      scrollToResults();
    } catch (error) {
      // Handle different error types
      if (error.response?.status === 404) {
        toast.error("No recipes found with this ingredient", {
          duration: 2000,
        });
      } else {
        toast.error("Failed to search recipes. Please try again.", {
          duration: 2000,
        });
      }
      console.error("Ingredient search error:", error);
    } finally {
      setIngredientLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const categoriesData = JSON.parse(
        localStorage.getItem("categories") ||
          "[" +
            document
              .querySelector('meta[name="categories"]')
              .getAttribute("content") +
            "]"
      );
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error parsing categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  const LoadingSpinner = () => <Loader className="w-4 h-4 animate-spin" />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-olive/5 via-white to-olive/10">
      {/* Hero Section */}
      <div className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
            Discover
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-olive/20 to-emerald-600/20 blur-lg"></span>
              <span className="relative bg-gradient-to-r from-emerald-800 to-olive bg-clip-text text-transparent">
                {" "}
                Amazing{" "}
              </span>
            </span>
            Recipes
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Explore our curated collection of delicious recipes from around the
            world
          </p>
        </div>
      </div>

      {/* Search Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12">
          {/* Category Search */}
          <SearchCard icon={ChefHat} title="Categories">
            <Select
              showSearch
              placeholder="Select a category"
              className="w-full"
              value={category?.name}
              onChange={(value) => {
                const selectedCategory = CATEGORIES.find(
                  (cat) => cat.name === value
                );
                setCategory(selectedCategory);
              }}
              disabled={categoryLoading}
            >
              {CATEGORIES.map((cat) => (
                <Option key={cat._id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
            <Button
              onClick={handleCategorySearch}
              className="w-full bg-olive text-white hover:bg-olive/90 transition-all h-10"
              disabled={categoryLoading}
            >
              {categoryLoading ? <LoadingSpinner /> : "Search by Category"}
            </Button>
          </SearchCard>

          {/* Ingredient Search */}
          <SearchCard icon={Soup} title="Ingredients">
            <Input
              placeholder="Search by ingredient..."
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              startContent={<Search className="text-gray-400" />}
              className="w-full"
              disabled={ingredientLoading}
            />
            <Button
              onClick={handleIngredientSearch}
              className="w-full bg-olive text-white hover:bg-olive/90 transition-all h-10"
              disabled={ingredientLoading}
            >
              {ingredientLoading ? <LoadingSpinner /> : "Search by Ingredient"}
            </Button>
          </SearchCard>

          {/* Recipe Name Search */}
          <SearchCard
            icon={BookOpen}
            title="Recipe Name"
            className="md:col-span-2 lg:col-span-1"
          >
            <Input
              placeholder="Search recipes..."
              startContent={<Search className="text-gray-400" />}
              className="w-full"
              value={searchQuery}
              disabled={Searching}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={handleRecipeSearch}
              className="w-full bg-olive text-white hover:bg-olive/90 transition-all h-10"
              disabled={Searching}
            >
              {Searching ? <LoadingSpinner /> : "Search by Name"}
            </Button>
          </SearchCard>
        </div>

        {/* Random Recipe Button */}
        <div className="flex justify-center px-4">
          <Button
            onClick={handleRandomClick}
            disabled={randomLoading}
            className="group w-full sm:w-auto bg-olive hover:bg-olive/90 text-white text-base sm:text-lg px-6 sm:px-12 py-4 sm:py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {randomLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                <span className="whitespace-nowrap">Surprise Me!</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div
        ref={resultsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="p-2 sm:p-3 bg-olive/10 rounded-xl">
              <Soup className="w-6 h-6 text-olive" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Recipes Based on Ingredients
            </h2>
          </div>
          <div className="min-h-[200px]">
            {ingredientLoading ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner />
              </div>
            ) : ingredientError ? (
              <p className="text-center text-red-500">
                {ingredientError.message ||
                  "An error occurred while fetching recipes. Please try again."}
              </p>
            ) : recipe.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipe.map((item) => (
                  <RecipeCard key={item._id} recipe={item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No recipes found for the given ingredient.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { Button, ConfigProvider, Select } from "antd";
import {
  Search,
  ChefHat,
  Soup,
  Sparkles,
  Loader,
  LucideCookingPot,
  MapPin,
  AlertCircle,
  ChefHatIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useGetRandomRecipe from "/src/hooks/useGetRandomRecipe";
import RecipeCard from "/src/components/RecipeCard/RecipeCard";
import toast from "react-hot-toast";
import useGetRecipeByIngrediants from "/src/hooks/useGetRecipeByIngrediants";
import useGetAllIngredients from "/src/hooks/useGetAllIngredients";
import useGetRecipeByCat from "/src/hooks/useGetRecipeByCat";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";
import useGetAllAreas from "/src/hooks/useGetAllAreas";
import useGetRecipeByArea from "/src/hooks/useGetRecipeByArea";
import { Spinner } from "@nextui-org/react";

const { Option } = Select;

const LoadingOverlay = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
      >
        <div className="flex flex-col items-center gap-4">
          <ChefHatSpinner size={48} />
          <p className="text-olive font-medium animate-pulse">
            Cooking up results...
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ErrorAlert = ({ message }) => (
  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start">
      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
      <div className="ml-3 w-full">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  </div>
);

const SearchCard = ({
  icon: Icon,
  title,
  children,
  className = "",
  loading,
  error,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${className} relative bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1`}
  >
    <LoadingOverlay visible={loading} />
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 sm:p-3 bg-olive/10 rounded-xl">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-olive" />
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
        {title}
      </h2>
    </div>
    <div className="space-y-4">
      {children}
      {error && <ErrorAlert message={error} />}
    </div>
  </motion.div>
);

const LoadingResults = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-2xl p-4 shadow-md">
        <div className="h-48 w-full rounded-xl mb-4 bg-gray-200 animate-pulse" />
        <div className="h-6 w-3/4 mb-2 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
      </div>
    ))}
  </div>
);

const NoRecipesFound = ({ recipeResults, category }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-12 text-gray-500"
  >
    <ChefHatIcon className="w-16 h-16 mb-4 text-darkolive animate-pulse" />

    <p className="text-gray-400 text-center max-w-md mb-6">
      {recipeResults.length === 0 && category === "" ? (
        <>🍴 Hey there! Feeling hungry? Start by searching for a recipe!</>
      ) : recipeResults.length === 0 && !category ? (
        <>
          🤔 No recipes found for the selected category. Why not try a different
          one?
        </>
      ) : (
        <>🛠️ Oops! Something went wrong. Please try again.</>
      )}
    </p>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-8 text-sm text-gray-400"
    >
      🔥 Check out{" "}
      <span
        className="text-olive font-bold cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Popular Recipes
      </span>{" "}
      or refine your search.
    </motion.div>
  </motion.div>
);

export default function RecipePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [CATEGORIES, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState(new Set([]));
  const [selectedArea, setSelectedArea] = useState(null);
  const [recipeResults, setRecipeResults] = useState([]);

  const {
    loading: ingredientLoading,
    ingredientNames,
    error: ingredientError1,
    fetchAllIngrediants,
  } = useGetAllIngredients();

  const {
    loading: ingredientLoading1,
    error: ingredientError,
    recipe: recipesByIngrediants,
    getRecipeByIngredients,
  } = useGetRecipeByIngrediants();

  const {
    getRecipesByCat,
    loading: catLoading,
    error: catError,
  } = useGetRecipeByCat();

  const {
    area,
    fetchALlAreas,
    loading: areaFetchLoading,
    error: AreaFetchError,
  } = useGetAllAreas();

  const {
    loading: RecipesByAreaLoading,
    error: RecipesByAreaError,
    recipes: RecipesByArea,
    getRecipesByArea,
  } = useGetRecipeByArea();

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
      toast.error(randomError || error || "Failed to fetch random recipe");
      console.error(error);
    }
  };

  const handleCategorySearch = async () => {
    if (!category) {
      toast.error("Please select a category first");
      return;
    }

    setCategoryLoading(true);
    try {
      // Fetch recipes directly
      const recipes = await getRecipesByCat(category?._id);

      if (recipes?.data?.length > 0) {
        // Update local state or perform actions
        setRecipeResults(recipes.data);
        scrollToResults();
      } else {
        toast.error("No recipes found for the selected category.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Category search failed. Please try again."
      );
      console.error("Error during category search:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleIngredientSearch = async () => {
    if (selectedIngredients.size === 0) {
      toast.error("Please select at least one ingredient");
      return;
    }

    try {
      const ingredientsArray = Array.from(selectedIngredients);

      // Call the hook's method to fetch the recipes
      await getRecipeByIngredients(ingredientsArray);

      // Check if the recipe state is updated before using it

      if (recipesByIngrediants.length > 0) {
        setRecipeResults(recipesByIngrediants); // Update state with fetched recipes

        scrollToResults(); // Scroll to the results section
      }
      // else {
      //   toast.error("No recipes found with these ingredients");
      //   console.log("No recipes found with these ingredients");
      // }
    } catch (error) {
      toast.error(
        error?.response?.status === 404
          ? "No recipes found with these ingredients"
          : "Failed to search recipes"
      );
      console.error(error);
    }
  };
  useEffect(() => {
    if (recipesByIngrediants.length > 0) {
      setRecipeResults(recipesByIngrediants);

      scrollToResults();
    }
  }, [recipesByIngrediants]);

  const handleAreaSearch = async () => {
    if (!selectedArea) {
      toast.error("Please select a cuisine area.");
      return;
    }

    try {
      await getRecipesByArea(selectedArea);
      setRecipeResults(RecipesByArea);
      scrollToResults();
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };
  useEffect(() => {
    if (RecipesByArea.length > 0) {
      setRecipeResults(RecipesByArea);
      scrollToResults();
    }
  }, [RecipesByArea]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllIngrediants();
    fetchALlAreas();
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
    document.title = " Foodigo | Recipes ";
  }, []);

  const LoadingSpinner = () => <ChefHatSpinner size={32} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-olive/5 via-white to-olive/10">
      {/* Hero Section */}
      <div className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
            Discover{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-olive/20 to-emerald-600/20 blur-lg">
                {" "}
              </span>
              <span className="relative bg-gradient-to-r from-emerald-800 to-olive bg-clip-text text-transparent">
                Amazing
              </span>
            </span>{" "}
            Recipes
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Explore our curated collection of delicious recipes from around the
            world
          </p>
        </div>
      </div>

      {/* Search Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20 ">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12 ">
          {/* Category Search */}
          <SearchCard icon={ChefHat} title="Categories">
            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    activeBorderColor: "olive",
                    activeOutlineColor: "darkolive",
                    hoverBorderColor: "lightolive",
                  },
                  Button: {
                    defaultBg: "olive",
                    defaultHoverBg: "darkolive",
                    defaultHoverColor: "white",
                    defaultActiveBorderColor: "olive",
                    defaultBorderColor: "olive",
                    defaultShadow: "olive",
                    boxShadow: "olive",
                  },
                },
              }}
            >
              <div className="space-y-4 bg-transparent rounded-2xl">
                <Select
                  showSearch
                  allowClear
                  variant="filled"
                  placeholder="Select a category"
                  placement="bottomLeft"
                  className="w-full text-md rounded-lg border-2 border-gray-300 focus-within:ring-2 focus-within:ring-olive transition-all hover:border-olive focus:border-olive focus:outline-none"
                  value={category?.name}
                  onChange={(value) => {
                    const selectedCategory = CATEGORIES.find(
                      (cat) => cat.name === value
                    );
                    setCategory(selectedCategory);
                  }}
                  disabled={categoryLoading}
                  popupClassName="rounded-lg shadow-xl bg-white max-h-80 overflow-auto"
                  loading={categoryLoading || catLoading}
                >
                  {CATEGORIES.map((cat) => (
                    <Option key={cat._id} value={cat.name}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>

                <Button
                  onClick={handleCategorySearch}
                  className="w-full h-12 bg-olive text-white font-semibold rounded-full shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={categoryLoading}
                >
                  {categoryLoading ? <LoadingSpinner /> : "Search by Category"}
                </Button>
              </div>
            </ConfigProvider>
          </SearchCard>

          {/* Ingredient Search */}
          <SearchCard icon={LucideCookingPot} title="Ingredients">
            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    activeBorderColor: "olive",
                    activeOutlineColor: "darkolive",
                    hoverBorderColor: "lightolive",
                  },
                  Button: {
                    defaultBg: "olive",
                    defaultHoverBg: "darkolive",
                    defaultHoverColor: "white",
                    defaultActiveBorderColor: "olive",
                    defaultBorderColor: "olive",
                    defaultShadow: "olive",
                    boxShadow: "olive",
                  },
                },
              }}
            >
              <div className="space-y-4 bg-transparent rounded-2xl">
                <Select
                  mode="multiple"
                  showSearch
                  loading={ingredientLoading}
                  variant="filled"
                  placement={"bottomLeft"}
                  allowClear
                  className="w-full text-md rounded-lg border-2 border-gray-300 focus-within:ring-2 focus-within:ring-olive transition-all hover:border-olive focus:border-olive focus:outline-none"
                  placeholder={
                    <div className="flex items-center gap-2 text-gray-500">
                      <Search className="text-gray-400" size={16} />
                      <span>Type Something like Beef, Eggs...</span>
                    </div>
                  }
                  value={Array.from(selectedIngredients)} // Convert Set to Array for Select's value
                  onChange={(values) => {
                    setSelectedIngredients(new Set(values));
                  }}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  options={ingredientNames.map((ing) => ({
                    value: ing.name, // Use the ingredient name for selection
                    label: ing.name, // Display the ingredient name
                  }))}
                  popupClassName="rounded-lg shadow-lg bg-white max-h-80 overflow-auto"
                  disabled={ingredientLoading || ingredientLoading1}
                />
                <Button
                  onClick={handleIngredientSearch}
                  className="w-full h-12 bg-olive text-white font-semibold rounded-full shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  // disabled={ingredientLoading || ingredientLoading1}
                >
                  {ingredientLoading1 ? (
                    <ChefHatSpinner size={32} />
                  ) : (
                    "Search by Ingredient"
                  )}
                </Button>
              </div>
            </ConfigProvider>
          </SearchCard>

          {/* Recipe Area Search */}
          <SearchCard
            icon={MapPin}
            title="Recipe Area"
            className="md:col-span-2 lg:col-span-1"
          >
            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    activeBorderColor: "olive",
                    activeOutlineColor: "darkolive",
                    hoverBorderColor: "lightolive",
                  },
                  Button: {
                    defaultBg: "olive",
                    defaultHoverBg: "darkolive",
                    defaultHoverColor: "white",
                    defaultActiveBorderColor: "olive",
                    defaultBorderColor: "olive",
                    defaultShadow: "olive",
                    boxShadow: "olive",
                  },
                },
              }}
            >
              <div className="space-y-4 bg-transparent rounded-2xl">
                <Select
                  showSearch
                  variant="filled"
                  placement={"bottomLeft"}
                  allowClear
                  className="w-full text-md rounded-lg border-2 border-gray-300 focus-within:ring-2 focus-within:ring-olive transition-all hover:border-olive focus:border-olive focus:outline-none"
                  placeholder={
                    <div className="flex items-center gap-2 text-gray-500">
                      <Search className="text-gray-400" size={16} />
                      <span>Search By Cuisine</span>
                    </div>
                  }
                  optionFilterProp="label"
                  options={area.map((gunna) => ({
                    value: gunna._id,
                    label: gunna.name,
                  }))}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  value={selectedArea}
                  onChange={(value) => setSelectedArea(value)}
                  popupClassName="rounded-lg shadow-lg bg-white max-h-80 overflow-auto"
                  disabled={RecipesByAreaLoading}
                />

                <Button
                  onClick={handleAreaSearch}
                  className="w-full h-12 bg-olive text-white font-semibold rounded-full shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {RecipesByAreaLoading ? (
                    <ChefHatSpinner size={32} />
                  ) : (
                    "Search by Area"
                  )}
                </Button>
              </div>
            </ConfigProvider>
          </SearchCard>
        </div>

        {/* Random Recipe Button */}
        <div className="flex justify-center px-4">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: "olive",
                  defaultHoverBg: "darkolive",
                  defaultHoverColor: "white",
                  defaultActiveBorderColor: "olive",
                  defaultBorderColor: "olive",
                  defaultShadow: "olive",
                  boxShadow: "olive",
                },
              },
            }}
          >
            <Button
              onClick={handleRandomClick}
              disabled={randomLoading}
              className="flex items-center justify-center w-full sm:w-auto bg-olive hover:bg-darkolive text-white text-base sm:text-lg px-6 sm:px-12 py-4 sm:py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {randomLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Surprise Me!</span>
                </div>
              )}
            </Button>
          </ConfigProvider>
        </div>
      </div>

      {/* Results Section */}
      <motion.div
        ref={resultsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="p-2 sm:p-3 bg-olive/10 rounded-xl">
              <Soup className="w-6 h-6 text-olive" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Recipes <span className="text-darkolive">Found:</span>
            </h2>
          </div>
          <div className="min-h-[200px] relative">
            <AnimatePresence mode="wait">
              {ingredientLoading || catLoading || areaFetchLoading ? (
                <LoadingResults />
              ) : ingredientError ||
                catError ||
                AreaFetchError ||
                RecipesByAreaError ? (
                <ErrorAlert
                  message={
                    ingredientError?.message ||
                    catError?.message ||
                    AreaFetchError?.message ||
                    RecipesByAreaError?.message ||
                    "An error occurred while fetching recipes."
                  }
                />
              ) : recipeResults.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {recipeResults.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RecipeCard recipe={item} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <NoRecipesFound
                  recipeResults={recipeResults}
                  category={category}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

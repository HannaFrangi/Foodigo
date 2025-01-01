import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useGetRecipeByArea = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [recipes, setRecipes] = useState([]);

  const getRecipesByArea = async (areaId) => {
    if (!areaId) {
      toast.error("Please select an area.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching recipes for area ID: ${areaId}`);
      const response = await axiosInstance.get(`/recipe/area/${areaId}`);
      console.log("API Response:", response);

      const recipeCount = response?.data?.count || 0;
      const recipeData = response?.data?.data || [];

      setCount(recipeCount);
      setRecipes(recipeData);

      if (recipeCount > 0) {
        toast.success(`${recipeCount} recipe(s) found!`);
      } else {
        toast.error("No recipes found for the selected area.");
      }
    } catch (error) {
      console.error("API Error:", error.response || error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, count, recipes, getRecipesByArea };
};

export default useGetRecipeByArea;

import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useGetRecipeByIngrediants = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState([]);

  const getRecipeByIngrediants = async (ingrediants) => {
    if (!ingrediants || ingrediants.trim().length === 0) {
      toast.error("Ingredients cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/recipe/search_ingredient?ingredients=${ingrediants}`
      );

      const data = response?.data?.data || [];
      setRecipe(data);

      if (data.length === 0) {
        toast.error("No recipes found for the given ingredients");
      }
    } catch (err) {
      setError(err);
      toast.error(
        err.response?.data?.message ||
          "An error occurred while fetching recipes"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, recipe, getRecipeByIngrediants };
};

export default useGetRecipeByIngrediants;

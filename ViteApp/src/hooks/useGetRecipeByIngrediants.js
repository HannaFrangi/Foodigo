import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useGetRecipeByIngredients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState([]);

  const getRecipeByIngredients = async (ingredients) => {
    if (!ingredients || ingredients.length === 0) {
      toast.error("Please select at least one ingredient");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Convert array of ingredients into a comma-separated string
      const ingredientQuery = ingredients.join(",");
      const response = await axiosInstance.get(
        `/recipe/search_ingredient?ingredients=${ingredientQuery}`
      );

      const data = response?.data?.data || [];
      setRecipe(data);
      if (data.length === 0) {
        toast.error("No recipes found for the selected ingredients");
      } else {
        toast.success(`${data.length} recipe(s) found!`);
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

  return { loading, error, recipe, getRecipeByIngredients };
};

export default useGetRecipeByIngredients;

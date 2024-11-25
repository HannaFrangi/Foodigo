import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useGetRecipeById = (id) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Recipe, setRecipe] = useState({});
  console.log(id);

  const fetchRecipeById = async () => {
    if (!id) {
      setError("Invalid ID");
      toast.error("Invalid ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/recipe/${id}`);
      const recipe = response.data || null;

      if (recipe) {
        setRecipe(recipe);
      } else {
        throw new Error("Recipe not found");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch the recipe.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the recipe when the component mounts or the id changes
  useEffect(() => {
    if (id) {
      fetchRecipeById();
      console.log(Recipe);
    }
  }, [id]);
  return { Recipe, loading, error, fetchRecipeById };
};

export default useGetRecipeById;

import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useGetRecipeByCat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [catRecipes, setCatRecipes] = useState([]); // Consistent naming

  const getRecipesByCat = async (category) => {
    if (!category) throw new Error("Category is required");

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/recipe/category/${category}`);
      const data = response?.data || [];

      setCatRecipes(data); // Update state
      toast.success(`${response.data.count} recipe(s) found!`);
      return data; // Return data directly
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while fetching recipes";
      setError(errorMessage);
      throw err; // Re-throw for external handling
    } finally {
      setLoading(false);
    }
  };

  return { getRecipesByCat, loading, error, catRecipes };
};

export default useGetRecipeByCat;

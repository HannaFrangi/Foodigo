import { useState, useCallback } from "react";
import { axiosInstance } from "../lib/axios";

const useGetIngredientNamesByIds = () => {
  const [ingredientNames, setIngredientNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIngredientNamesByIds = useCallback(async (ingredientIds) => {
    if (!ingredientIds || ingredientIds.length === 0) {
      setError("No ingredient IDs provided");
      return {};
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/ingredients");

      const namesMap = {};
      for (const ingredient of response.data.data) {
        if (ingredientIds.includes(ingredient._id.toString())) {
          namesMap[ingredient._id] = ingredient.name;
        }
      }
      setIngredientNames(namesMap);
      return namesMap;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch ingredient names";
      setError(errorMessage);
      console.error("Error fetching ingredient names:", err);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  // Return hook values
  return {
    ingredientNames,
    loading,
    error,
    fetchIngredientNamesByIds,
  };
};

export default useGetIngredientNamesByIds;

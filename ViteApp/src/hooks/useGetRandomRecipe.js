import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const useGetRandomRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomRecipe, setRandomRecipe] = useState(null);

  const getRandomRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/recipe/random");
      if (response?.data?.data) {
        const recipe = response.data.data;
        setRandomRecipe(recipe); // Update state for external use
        return recipe; // Return the recipe directly
      } else {
        throw new Error("Invalid API response structure.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getRandomRecipe, loading, error, randomRecipe };
};

export default useGetRandomRecipe;

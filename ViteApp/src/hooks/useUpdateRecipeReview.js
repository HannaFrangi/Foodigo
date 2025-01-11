import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const useUpdateRecipeReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateRecipeReview = async ({ recipeId, reviewData }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await axiosInstance.put(
        `recipe/${recipeId}/review`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError("Failed to update the review.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return {
    updateRecipeReview,
    loading,
    error,
    success,
  };
};

export default useUpdateRecipeReview;

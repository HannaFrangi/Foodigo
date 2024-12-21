import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const useDeleteRecipeReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const DeleteRecipeReview = async (recipeId, { onSuccess, onError } = {}) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axiosInstance.delete(`/recipe/${recipeId}/review`);
      if (response.status === 200) {
        setSuccess(true);
        if (onSuccess) onSuccess(response.data); // Execute onSuccess callback if provided
      } else {
        const errorMessage =
          response.data?.message || "Failed to delete the review.";
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete the review.";
      setError(errorMessage);
      console.error("Delete Review Error:", error);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, DeleteRecipeReview };
};

export default useDeleteRecipeReview;

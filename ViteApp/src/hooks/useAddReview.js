import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const useAddReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addReview = async ({ recipeId, rating, comment }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axiosInstance.post(`/recipe/${recipeId}/review`, {
        rating,
        comment,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { addReview, loading, error, success };
};

export default useAddReview;

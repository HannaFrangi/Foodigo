import { axiosInstance } from "../lib/axios";
import { useState } from "react";

const useDeleteRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteRecipe = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(`/recipe/${id}`);
      if (response.success) {
        setSuccess(true);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, deleteRecipe };
};

export default useDeleteRecipe;

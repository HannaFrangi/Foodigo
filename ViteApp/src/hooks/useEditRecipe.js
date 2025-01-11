import { useState } from "react";
import { axiosInstance } from "../lib/axios";

export const useEditRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const editRecipe = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/recipe/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, editRecipe };
};

export default useEditRecipe;

import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const useAddRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addRecipe = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axiosInstance.post("/recipe", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);
      setLoading(false);
      return response.data;
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    }
  };

  return { addRecipe, loading, error, success };
};

export default useAddRecipe;

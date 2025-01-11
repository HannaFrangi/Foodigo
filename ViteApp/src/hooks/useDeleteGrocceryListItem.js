import { useState, useCallback } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useDeleteGroceryItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const DeleteGroceryItem = useCallback(async (itemId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.delete(
        `users/removefromgrocerylist/${itemId}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    DeleteGroceryItem,
  };
};

export default useDeleteGroceryItem;

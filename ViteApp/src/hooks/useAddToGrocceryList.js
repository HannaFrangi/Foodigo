import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";

export const useAddToGroceryList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Helper function to format quantity
  const formatQuantity = (quantity) => {
    const matches = quantity.match(/^(\d+(\.\d+)?)([a-zA-Z]+)$/);
    if (matches) {
      return `${matches[1]} ${matches[3]}`;
    }
    return quantity;
  };

  // Helper function to validate final quantity format
  const isValidQuantityFormat = (quantity) => {
    const formatRegex = /^\d+(\.\d+)?\s*[a-zA-Z]+$/;
    return formatRegex.test(quantity);
  };

  const addToGroceryList = async (ingredient) => {
    setLoading(true);
    setError(null);
    const formattedQuantity = formatQuantity(ingredient.quantity);

    if (!isValidQuantityFormat(formattedQuantity)) {
      setError("Quantity must be in format '2 kg', '1.5kg', or '1.5 kg'");
      toast.error("Quantity must be in format '2 kg', '1.5kg', or '1.5 kg'");
      setLoading(false);
      setSuccess(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`/users/addToGroceryList`, {
        ingredientID: ingredient.ingredientName,
        quantity: formattedQuantity,
      });

      if (response.data.success) {
        toast.success(`${ingredient.fullName} added to your grocery list.`, {
          icon: "🛒",
          style: {
            borderRadius: "10px",
          },
        });
        setSuccess(true);
      } else {
        throw new Error(
          response.data.message || "Failed to add to grocery list"
        );
      }
    } catch (err) {
      setError(err.message);
      setSuccess(false);
      toast.error(err.message || "Failed to add to grocery list");
    } finally {
      setLoading(false);
    }
  };

  return {
    addToGroceryList,
    loading,
    error,
    success,
  };
};

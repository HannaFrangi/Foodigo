import { axiosInstance } from "../lib/axios";
import { useState } from "react";

export const useAddToGrocceryList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Helper function to format quantity
  const formatQuantity = (quantity) => {
    // This regex separates numbers from letters
    const matches = quantity.match(/^(\d+)([a-zA-Z]+)$/);
    if (matches) {
      // If it matches the pattern of number+unit with no space, add the space
      return `${matches[1]} ${matches[2]}`;
    }
    return quantity;
  };

  // Helper function to validate final quantity format
  const isValidQuantityFormat = (quantity) => {
    const formatRegex = /^\d+\s[a-zA-Z]+$/;
    return formatRegex.test(quantity);
  };

  const addToGrocceryList = async (ingrediant) => {
    setLoading(true);
    setError(null);

    const formattedQuantity = formatQuantity(ingrediant.quantity);
    if (!isValidQuantityFormat(formattedQuantity)) {
      setError("Quantity must be in format '2 kg' or '2kg'");
      setLoading(false);
      setSuccess(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`/users/addToGroceryList`, {
        ingredientID: ingrediant.ingredientName,
        quantity: formattedQuantity,
      });
      console.log(response);
      if (response.data.success) {
        toast.success(`${ingrediant.fullName} added to your grocery list.`, {
          icon: "🛒",
          style: {
            borderRadius: "10px",
          },
        });
      } else {
        throw new Error(
          response.data.message || "Failed to add to groccery list"
        );
      }
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    addToGrocceryList,
    loading,
    error,
    success,
  };
};

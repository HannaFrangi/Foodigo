import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";

const MEASUREMENT_UNITS = {
  common: [
    { value: "g", label: "Grams (g)" },
    { value: "ml", label: "Milliliters (ml)" },
    { value: "cup", label: "Cups" },
    { value: "tbsp", label: "Tablespoons" },
    { value: "tsp", label: "Teaspoons" },
    { value: "pcs", label: "Pieces" },
    { value: "bunch", label: "Bunch" },
    { value: "clove", label: "Clove" },
    { value: "slice", label: "Slice" },
  ],
  other: [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "l", label: "Liters (l)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "lb", label: "Pounds (lb)" },
    { value: "pinch", label: "Pinch" },
    { value: "whole", label: "Whole" },
    { value: "dash", label: "Dash" },
    { value: "drop", label: "Drop" },
    { value: "stick", label: "Stick" },
    { value: "can", label: "Can" },
    { value: "package", label: "Package" },
    { value: "handful", label: "Handful" },
  ],
};

export const useAddToGroceryList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validUnits = [...MEASUREMENT_UNITS.common, ...MEASUREMENT_UNITS.other]
    .map((unit) => unit.value)
    .join("|");

  // Helper function to format quantity
  const formatQuantity = (quantity) => {
    // Handle null, undefined, or empty string
    if (!quantity) {
      return "1 pcs";
    }

    // If quantity is just text without numbers, default to "1 pcs"
    if (isNaN(parseFloat(quantity))) {
      return "1 pcs";
    }

    const matches = quantity
      .toString()
      .match(new RegExp(`^(\\d+(\\.\\d+)?)(${validUnits})$`));
    if (matches) {
      return `${matches[1]} ${matches[3]}`;
    }

    // If quantity is just a number without unit, append "pcs"
    if (!isNaN(quantity)) {
      return `${parseFloat(quantity)} pcs`;
    }

    return quantity;
  };

  // Helper function to validate final quantity format
  const isValidQuantityFormat = (quantity) => {
    // Always consider "X pcs" as valid format
    if (quantity.endsWith(" pcs")) {
      const numValue = parseFloat(quantity);
      return !isNaN(numValue) && numValue > 0;
    }
    const formatRegex = new RegExp(`^\\d+(\\.\\d+)?\\s*(${validUnits})$`);
    return formatRegex.test(quantity);
  };

  const addToGroceryList = async (ingredient) => {
    setLoading(true);
    setError(null);
    const formattedQuantity = formatQuantity(ingredient.quantity);

    if (!isValidQuantityFormat(formattedQuantity)) {
      const validUnitsMessage = [
        ...MEASUREMENT_UNITS.common,
        ...MEASUREMENT_UNITS.other,
      ]
        .map((unit) => unit.value)
        .join(", ");
      const errorMessage = `Quantity must be in format '2 unit' or '1.5 unit'. Valid units are: ${validUnitsMessage}`;
      setError(errorMessage);
      toast.error(errorMessage);
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

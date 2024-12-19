import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const useGetAllIngredients = () => {
  const [ingredientNames, setIngredientNames] = useState([]); // Array instead of object
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllIngrediants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("ingredients/");

      // Convert response data to array of objects: [{ id: ..., name: ... }, ...]
      const namesArray = response.data.data.map((ingredient) => ({
        id: ingredient._id,
        name: ingredient.name,
      }));
      console.log(response.data.data);
      setIngredientNames(namesArray);
    } catch (e) {
      setIngredientNames([]);
      console.error(e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    ingredientNames,
    error,
    fetchAllIngrediants,
  };
};

export default useGetAllIngredients;

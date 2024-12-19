import { useState, useCallback } from "react";
import { axiosInstance } from "../lib/axios";
import { useEffect } from "react";

const useGetAreaByid = () => {
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIngredientAreaByIds = useCallback(async (areaId) => {
    if (!areaId || areaId.length === 0) {
      setError("No ingredient IDs provided");
      return {};
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/area/getAreaById/${areaId}`);
      setArea(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch ingredient names";
      setError(errorMessage);
      console.error("Error fetching ingredient names:", err);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredientAreaByIds();
  }, []);

  return {
    area,
    loading,
    error,
    fetchIngredientAreaByIds,
  };
};

export default useGetAreaByid;

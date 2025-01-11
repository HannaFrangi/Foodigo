import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const useGetAllAreas = () => {
  const [area, setArea] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchALlAreas = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/area");
      setArea(response.data.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchALlAreas();
  }, []);

  return { area, loading, error, fetchALlAreas };
};

export default useGetAllAreas;

import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const useGetGrocceryList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grocceryList, setGrocceryList] = useState([]);

  const getGrocceryList = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`users/getgroccerylist`);
      if (response.data.success) {
        setGrocceryList(response.data.groceryList);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGrocceryList();
  }, []);

  return { loading, error, grocceryList, getGrocceryList };
};

export default useGetGrocceryList;

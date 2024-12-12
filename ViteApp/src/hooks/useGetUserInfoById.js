import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

const useGetUserInfoById = (userID) => {
  const [userInfo, setUserInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/users/getUserInfoByID/${userID}`
      );
      if (response.data.success) {
        setUserInfo(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch user info");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!userID) return;
    fetchUserInfo();
  }, [userID]);

  return { userInfo, isLoading, error, fetchUserInfo };
};

export default useGetUserInfoById;

import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { checkAuth } = useAuthStore();

  const updateProfile = async (profilePic, name) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("profilePic", profilePic);
      formData.append("name", name);

      const response = await axiosInstance.put(
        "/users/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      checkAuth();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error, success };
};

export default useUpdateProfile;

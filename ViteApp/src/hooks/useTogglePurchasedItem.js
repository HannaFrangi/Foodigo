import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useTogglePurchasedItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const togglePurchasedItem = async (grooceryItemID) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch("/users/togglepurchased/", {
        groceryItemId: grooceryItemID,
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success("Item purchased status updated successfully.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, togglePurchasedItem };
};

export default useTogglePurchasedItem;

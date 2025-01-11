import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

const useGetReviewsById = (id) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/recipe/${id}/review`);
      setReviews(response.data.reviews);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  return { reviews, loading, error, fetchReviews };
};

export default useGetReviewsById;

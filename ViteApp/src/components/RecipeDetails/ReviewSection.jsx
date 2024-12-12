import React, { useState, useEffect } from "react";
import { Avatar, Rate, Modal, Button, Input } from "antd";
import useGetUserInfoById from "/src/hooks/useGetUserInfoById";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";
import { useAuthStore } from "/src/store/useAuthStore";
import useAddReview from "../../hooks/useAddReview";

const { TextArea } = Input;

export const ReviewSection = ({ reviews, recipeId }) => {
  const { authUser } = useAuthStore();

  const [reviewAuthors, setReviewAuthors] = useState({});
  const [loadingUserIds, setLoadingUserIds] = useState(
    reviews.map((review) => review.user)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const { addReview, loading, error, success } = useAddReview();

  // Create user info hooks for each unique user ID
  const userInfoHooks = reviews.reduce((acc, review) => {
    if (!acc[review.user]) {
      acc[review.user] = useGetUserInfoById(review.user);
    }
    return acc;
  }, {});

  // Track loading and user info
  useEffect(() => {
    const updatedAuthors = {};
    const stillLoading = [];

    reviews.forEach((review) => {
      const { userInfo, isLoading } = userInfoHooks[review.user];

      if (userInfo) {
        updatedAuthors[review.user] = userInfo;
      }

      if (isLoading) {
        stillLoading.push(review.user);
      }
    });

    setReviewAuthors((prevAuthors) => ({
      ...prevAuthors,
      ...updatedAuthors,
    }));

    setLoadingUserIds(stillLoading);
  }, [
    ...Object.values(userInfoHooks).map((hook) => hook.isLoading),
    ...Object.values(userInfoHooks).map((hook) => hook.userInfo),
  ]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewReview({ rating: 0, comment: "" });
  };

  const handleAddReview = async () => {
    await addReview({
      recipeId,
      rating: newReview.rating,
      comment: newReview.comment,
    });

    if (success) {
      onReviewAdded(newReview);
      handleCloseModal();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-olive-800">Reviews</h2>
        {authUser && (
          <Button
            type="link"
            onClick={handleOpenModal}
            className="text-olive-800"
          >
            Add Review
          </Button>
        )}
      </div>
      {loadingUserIds.length > 0 && <ChefHatSpinner />}

      {reviews.length === 0 ? (
        <div>No reviews yet</div>
      ) : (
        reviews.map((review) => (
          <div key={review.user} className="border-b pb-4 mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar
                src={
                  reviewAuthors[review.user]?.ProfilePicURL ||
                  "/src/assets/logo.png"
                }
                alt={reviewAuthors[review.user]?.name || "Anonymous"}
                size={40}
                className="border-2 border-[#5d6544] shadow-sm shadow-olive"
              />
              <div>
                <p className="font-semibold text-olive-900">
                  {reviewAuthors[review.user]?.name || "Anonymous"}
                </p>
                <Rate disabled value={review.rating} />
              </div>
            </div>
            <p className="text-olive-800">{review.comment}</p>
            <p className="text-sm text-gray-600">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        ))
      )}

      <Modal
        title="Add a Review"
        open={isModalOpen}
        onOk={handleAddReview}
        onCancel={handleCloseModal}
        okText="Submit"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <div className="flex flex-col space-y-4">
          <Rate
            onChange={(value) =>
              setNewReview((prev) => ({ ...prev, rating: value }))
            }
            value={newReview.rating}
          />
          <TextArea
            rows={4}
            placeholder="Write your review here..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Modal>
    </div>
  );
};

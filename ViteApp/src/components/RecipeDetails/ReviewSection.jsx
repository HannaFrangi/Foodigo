import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Rate, Modal, Button, Input } from "antd";
import { toast } from "react-hot-toast";
import { Star, MessageSquare, PenIcon, TrashIcon } from "lucide-react";
import { useAuthStore } from "/src/store/useAuthStore";
import useAddReview from "../../hooks/useAddReview";
import useUpdateRecipeReview from "/src/hooks/useUpdateRecipeReview";
import useDeleteRecipeReview from "/src/hooks/useDeleteRecipeReview";
import useGetReviewsById from "../../hooks/useGetReviewsById";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";

const { TextArea } = Input;

export const ReviewSection = ({ recipeId }) => {
  const { authUser } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  const { addReview, loading: addLoading } = useAddReview();
  const { updateRecipeReview, loading: updateLoading } =
    useUpdateRecipeReview();
  const { DeleteRecipeReview, loading: deleteLoading } =
    useDeleteRecipeReview();
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    fetchReviews,
  } = useGetReviewsById(recipeId);

  const userHasWrittenReview = useMemo(
    () => reviews?.some((review) => review.user._id === authUser?._id),
    [reviews, authUser]
  );

  const handleOpenModal = () => {
    if (userHasWrittenReview) {
      const existingReview = reviews.find(
        (review) => review.user._id === authUser?._id
      );
      if (existingReview) {
        setNewReview({
          rating: existingReview.rating,
          comment: existingReview.comment,
        });
      }
    } else {
      setNewReview({ rating: 0, comment: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewReview({ rating: 0, comment: "" });
  };

  const handleAddReview = async () => {
    if (!newReview.rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      const reviewData = {
        rating: newReview.rating,
        comment: newReview.comment,
      };

      if (userHasWrittenReview) {
        await updateRecipeReview({ recipeId, reviewData });
        toast.success("Review updated successfully!");
      } else {
        await addReview({ recipeId, ...reviewData });
        toast.success("Review added successfully!");
      }
      handleCloseModal();
      await fetchReviews(); // Refresh reviews list after adding/updating
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleDeleteReview = async () => {
    try {
      await DeleteRecipeReview(recipeId); // Call delete API
      toast.success("Review deleted successfully!");
      handleCloseModal(); // Close the modal
      await fetchReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 rounded-xl"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-olive flex items-center"
        >
          <MessageSquare className="mr-3 text-olive" size={28} />
          Reviews
        </motion.h2>
        {authUser && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="link"
              loading={addLoading || updateLoading}
              onClick={handleOpenModal}
              className="bg-olive  text-white flex items-center px-6 py-2 rounded-full shadow-md transition-all"
              icon={<PenIcon className="mr-2" size={18} />}
            >
              {userHasWrittenReview ? "Edit Review" : "Write a Review"}
            </Button>
          </motion.div>
        )}
      </div>

      {reviewsLoading ? (
        <div className="flex justify-center py-12">
          <ChefHatSpinner />
        </div>
      ) : (
        <AnimatePresence>
          {reviews?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              <MessageSquare size={48} className="mx-auto mb-4 text-olive" />
              <p className="text-lg">No reviews yet. Be the first to review!</p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {reviews?.map((review) => (
                <motion.div
                  key={review._id}
                  variants={itemVariants}
                  className=" p-6 rounded-lg "
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      <Avatar
                        src={
                          review.user.ProfilePicURL || "/src/assets/logo.png"
                        }
                        alt={review.user.name}
                        size={50}
                        className="border-2 border-olive shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-olive rounded-full p-1" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-olive">
                            {review.user.name || "Anonymous"}
                          </h3>
                          <Rate
                            disabled
                            value={review.rating}
                            className="text-amber-400"
                          />
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(review.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}

      <Modal
        title={
          <div className="flex items-center text-xl font-semibold">
            <Star className="mr-3 text-amber-400" size={24} />
            {userHasWrittenReview
              ? "Edit Your Review"
              : "Share Your Experience"}
          </div>
        }
        open={isModalOpen}
        onOk={handleAddReview}
        onCancel={handleCloseModal}
        className="review-modal"
        footer={[
          userHasWrittenReview && (
            <Button
              key="delete"
              type="primary"
              danger
              onClick={handleDeleteReview}
              icon={<TrashIcon className="mr-2" size={16} />}
              className="hover:bg-red-50"
            >
              Delete Review
            </Button>
          ),
          <Button
            key="submit"
            type="primary"
            onClick={handleAddReview}
            loading={addLoading || updateLoading}
            className="bg-olive hover:bg-olive/90"
            icon={<Star className="mr-2" size={16} />}
          >
            {userHasWrittenReview ? "Update Review" : "Submit Review"}
          </Button>,
        ].filter(Boolean)}
      >
        <div className="flex flex-col space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Rate
              onChange={(value) =>
                setNewReview((prev) => ({ ...prev, rating: value }))
              }
              value={newReview.rating}
            />
          </motion.div>
          <TextArea
            rows={4}
            placeholder="Write your review here..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
          />
        </div>
        {reviewsError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mt-2"
          >
            {reviewsError}
          </motion.p>
        )}
      </Modal>
    </motion.div>
  );
};

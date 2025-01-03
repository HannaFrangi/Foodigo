import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Rate, Modal, Button, Input } from "antd";
import { toast } from "react-hot-toast";
import { Star, MessageSquare, PenIcon, TrashIcon, X } from "lucide-react";
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

  const modalStyles = {
    content: {
      padding: 0,
      borderRadius: "16px",
      overflow: "hidden",
    },
    body: {
      padding: "20px",
      maxHeight: "70vh",
      overflowY: "auto",
    },
    mask: {
      backdropFilter: "blur(5px)",
      background: "rgba(0, 0, 0, 0.5)",
    },
    footer: {
      padding: "16px 20px",
      background: "#f8f8f8",
      borderTop: "1px solid #eee",
    },
  };

  // Enhanced modal animations
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 rounded-xl"
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
              style={{ color: "white" }}
              className="relative w-full bg-olive hover:bg-olive/80 text-white py-4 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-olive/30"
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
                  className=" rounded-lg py-2 "
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
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center text-xl font-semibold">
              <Star className="mr-3 text-amber-400" size={24} />
              <span className="hidden sm:inline">
                {userHasWrittenReview
                  ? "Edit Your Review"
                  : "Share Your Experience"}
              </span>
              <span className="sm:hidden">
                {userHasWrittenReview ? "Edit Review" : "New Review"}
              </span>
            </div>
            <Button
              type="text"
              icon={<X size={20} />}
              onClick={handleCloseModal}
              className="border-none hover:bg-gray-100 rounded-full p-2"
            />
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        className="review-modal sm:min-w-[500px]"
        closeIcon={null}
        centered
        styles={modalStyles}
        footer={
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {userHasWrittenReview && (
              <Button
                key="delete"
                onClick={handleDeleteReview}
                icon={<X className="w-4 h-4" />}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full
                  bg-red-500 text-white hover:bg-red-600 transition-all duration-300
                  shadow-xl shadow-red-500/30 w-full sm:w-auto order-2 sm:order-1 border-red-500 "
              >
                Delete
              </Button>
            )}
            <Button
              key="submit"
              onClick={handleAddReview}
              loading={addLoading || updateLoading}
              icon={<Star className="w-4 h-4" />}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full
                bg-olive text-white hover:bg-olive/90 transition-all duration-300
                shadow-lg shadow-olive/30 w-full sm:w-auto order-1 sm:order-2"
            >
              {userHasWrittenReview ? "Update" : "Submit"}
            </Button>
          </motion.div>
        }
      >
        <motion.div
          className="flex flex-col space-y-6 p-4"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-lg font-medium text-gray-700">
              Your Rating
            </span>
            <Rate
              onChange={(value) =>
                setNewReview((prev) => ({ ...prev, rating: value }))
              }
              value={newReview.rating}
              className="text-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <TextArea
              maxLength={500}
              showCount
              placeholder="Share your thoughts about this recipe..."
              value={newReview.comment}
              className="min-h-[150px] text-base p-3 rounded-xl border-gray-200
                focus:border-olive focus:ring-1 focus:ring-olive"
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {reviewsError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 mt-2 px-4"
            >
              {reviewsError}
            </motion.p>
          )}
        </AnimatePresence>
      </Modal>
    </motion.div>
  );
};

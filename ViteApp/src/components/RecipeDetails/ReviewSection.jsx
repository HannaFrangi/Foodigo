import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Rate, Modal, Button, Input } from "antd";
import { toast } from "react-hot-toast";
import { Star, PlusCircle, MessageSquare } from "lucide-react";
import useGetUserInfoById from "/src/hooks/useGetUserInfoById";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";
import { useAuthStore } from "/src/store/useAuthStore";
import useAddReview from "../../hooks/useAddReview";

const { TextArea } = Input;

export const ReviewSection = ({ reviews, recipeId, onReviewAdded }) => {
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
    if (newReview.rating === 0) {
      toast.error("Please select a rating", {
        duration: 3000,
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a review comment", {
        duration: 3000,
      });
      return;
    }

    try {
      const response = await addReview({
        recipeId,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      toast.success("Review added successfully!", {
        duration: 3000,
      });
      onReviewAdded?.(newReview);
      handleCloseModal();
    } catch (err) {
      toast.error("Failed to add review. Please try again.", {
        duration: 3000,
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
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
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <div className="flex justify-between items-center mb-4">
        <motion.h2
          className="text-xl font-semibold text-olive flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <MessageSquare className="mr-2 text-olive" size={24} />
          Reviews
        </motion.h2>
        {authUser && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="link"
              onClick={handleOpenModal}
              className="text-olive flex items-center"
              icon={<PlusCircle className="mr-1" size={16} />}
            >
              Add Review
            </Button>
          </motion.div>
        )}
      </div>

      {loadingUserIds.length > 0 && <ChefHatSpinner />}

      <AnimatePresence>
        {reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-6"
          >
            No reviews yet. Be the first to review!
          </motion.div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.user}
              variants={itemVariants}
              className="border-b pb-4 mb-4"
            >
              <div className="flex items-center space-x-3 mb-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar
                    src={
                      reviewAuthors[review.user]?.ProfilePicURL ||
                      "/src/assets/logo.png"
                    }
                    alt={reviewAuthors[review.user]?.name || "Anonymous"}
                    size={40}
                    className="border-2 border-[#5d6544] shadow-sm shadow-olive"
                  />
                </motion.div>
                <div>
                  <p className="font-semibold text-olive">
                    {reviewAuthors[review.user]?.name || "Anonymous"}
                  </p>
                  <Rate disabled value={review.rating} />
                </div>
              </div>
              <p className="text-black ">{review.comment}</p>
              <p className="text-sm text-gray-600">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      <Modal
        title={
          <div className="flex items-center">
            <Star className="mr-2 text-olive" />
            Add a Review
          </div>
        }
        open={isModalOpen}
        onOk={handleAddReview}
        onCancel={handleCloseModal}
        okText="Submit"
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{
          className: "bg-olive text-white hover:bg-olive",
          icon: <Star className="mr-1" size={16} />,
        }}
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
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mt-2"
          >
            {error}
          </motion.p>
        )}
      </Modal>
    </motion.div>
  );
};

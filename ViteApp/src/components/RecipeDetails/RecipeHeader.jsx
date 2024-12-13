import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "antd";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "/src/store/useAuthStore";
import toast from "react-hot-toast";

export const RecipeHeader = ({
  recipe,
  recipeTitle,
  recipeImage,
  authorInfo,
  recipeId,
}) => {
  const navigate = useNavigate();
  const { toggleFavorite, getFavorites } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const initializeCard = () => {
      const favorites = getFavorites();
      setIsLiked(favorites.includes(recipeId));
    };
    initializeCard();
  }, [getFavorites]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(recipeId);
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: window.location.href,
          title: recipeTitle,
        });
        toast.success("Recipe link shared!");
      } catch (error) {
        console.error("Error sharing URL:", error);
        toast.error("Failed to share recipe");
      }
    } else {
      toast.error("Sharing not supported in this browser");
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={recipeImage}
        alt={recipeTitle}
        className="w-full h-[400px] object-cover"
        initial={{ scale: 1.1, opacity: 0.8 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            duration: 1,
            ease: "easeOut",
          },
        }}
      />
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center justify-center 
            w-10 h-10 sm:w-11 sm:h-11 
            rounded-full 
            bg-white/80 hover:bg-white 
            backdrop-blur-sm 
            border border-gray-200/50 
            shadow-sm hover:shadow-md 
            transition-all duration-300 
            focus:outline-none 
            active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-olive transition" />
        </motion.button>

        <div className="flex space-x-2">
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isLiked ? "Unlike recipe" : "Like recipe"}
            className="group relative inline-flex items-center justify-center 
              w-10 h-10 sm:w-11 sm:h-11 
              rounded-full 
              bg-white/80 hover:bg-white 
              backdrop-blur-sm 
              border border-gray-200/50 
              shadow-sm hover:shadow-md 
              transition-all duration-300 
              focus:outline-none 
              active:scale-95"
          >
            <motion.svg
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 
                ${
                  isLiked
                    ? "text-red-500 fill-current"
                    : "text-gray-600 group-hover:text-red-400"
                }`}
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                scale: isLiked ? [1, 1.2, 1] : 1,
                rotate: isLiked ? [0, 20, -20, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </motion.svg>
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center 
              w-10 h-10 sm:w-11 sm:h-11 
              rounded-full 
              bg-white/80 hover:bg-white 
              backdrop-blur-sm 
              border border-gray-200/50 
              shadow-sm hover:shadow-md 
              transition-all duration-300 
              focus:outline-none 
              active:scale-95"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-olive transition" />
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <motion.h1
          className="text-4xl font-bold text-olive tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              delay: 0.2,
            },
          }}
        >
          {recipeTitle}
        </motion.h1>
        <motion.div
          className="flex items-center mt-4 space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
              delay: 0.4,
            },
          }}
        >
          <Avatar
            src={authorInfo?.ProfilePicURL || "/src/assets/logo.png"}
            alt={authorInfo?.name || "Foodigo Team"}
            className="border-2 border-[#5d6544] shadow-sm shadow-olive"
            size={50}
          />
          <p className="text-olive font-semibold text-lg">
            {authorInfo?.name || "Foodigo Team"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  Globe,
  Pen,
  Trash2,
  Video,
  Map,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "/src/store/useAuthStore";
import toast from "react-hot-toast";
import useGetAreaByid from "/src/hooks/useGetAreaByid";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";
import useDeleteRecipe from "/src/hooks/useDeleteRecipe";
import useEditRecipe from "/src/hooks/useEditRecipe";
import { Avatar } from "antd";

export const RecipeHeader = ({
  recipeTitle,
  recipeImage,
  authorInfo,
  recipeId,
  recipeArea,
  recipeVideoTutorial,
  recipeCategories,
}) => {
  const navigate = useNavigate();
  const [categoryNames, setCategoryNames] = useState([]);
  const { toggleFavorite, getFavorites, authUser } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const {
    area,
    loading: areaLoading,
    fetchIngredientAreaByIds,
  } = useGetAreaByid();
  const [isOwner, setIsOwner] = useState(false);
  const {
    deleteRecipe,
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteRecipe();

  const {
    editRecipe,
    loading: editLoading,
    error: editError,
    success: editSuccess,
  } = useEditRecipe();

  useEffect(() => {
    if (authUser) {
      setIsOwner(authUser?._id === authorInfo?._id);
    }
  }, [authUser, authorInfo]);

  useEffect(() => {
    fetchIngredientAreaByIds(recipeArea);
  }, [recipeArea, fetchIngredientAreaByIds]);

  useEffect(() => {
    const initializeCard = () => {
      const favorites = getFavorites();
      setIsLiked(favorites.includes(recipeId));
    };
    initializeCard();
  }, [getFavorites, recipeId]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Recipe deleted successfully");
      navigate("/");
    }
    if (deleteError) {
      toast.error(deleteError.message || "Failed to delete recipe");
    }
  }, [deleteSuccess, deleteError, navigate]);
  useEffect(() => {
    try {
      const storedCategories = JSON.parse(
        localStorage.getItem("categories") || "[]"
      );
      const categoryIds = Array.isArray(recipeCategories)
        ? recipeCategories
        : [recipeCategories];

      const names = categoryIds
        .map((categoryId) => {
          const category = storedCategories.find(
            (cat) => cat._id === categoryId
          );
          return category?.name || null;
        })
        .filter(Boolean);

      setCategoryNames(names.length > 0 ? names : ["Unknown"]);
    } catch (error) {
      console.error("Error processing categories:", error);
      setCategoryNames(["Unknown"]);
    }
  }, [recipeCategories]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(recipeId);
      setIsLiked((prev) => !prev);
      toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
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
          title: recipeTitle + " On Foodigo!",
        });
        toast.success("Recipe link shared!");
      } catch (error) {
        if (error.name !== "AbortError") {
          try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Recipe link copied to clipboard!");
          } catch (clipboardError) {
            toast.error("Failed to share or copy recipe link");
          }
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Recipe link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy recipe link");
      }
    }
  };

  const handleEdit = async () => {
    navigate(`/edit/${recipeId}`);
    await editRecipe(recipeId);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      await deleteRecipe(recipeId);
    }
  };

  if (areaLoading || deleteLoading || editLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <RecipeHeaderSkeleton />
      </motion.div>
    );
  }

  const ownerActionsButton = isOwner && (
    <motion.div className="flex items-center gap-3">
      <motion.button
        onClick={handleEdit}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center px-4 py-2 rounded-full
          bg-olive text-white space-x-2 hover:bg-olive/90 
          transition-colors shadow-sm hover:shadow-md"
        disabled={deleteLoading}
      >
        <Pen className="w-4 h-4" />
        <span>Edit Recipe</span>
      </motion.button>

      <motion.button
        onClick={handleDelete}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center px-4 py-2 rounded-full
          bg-red-500 text-white space-x-2 hover:bg-red-600 
          transition-colors shadow-sm hover:shadow-md"
        disabled={deleteLoading}
      >
        <Trash2 className={`w-4 h-4 ${deleteLoading ? "animate-spin" : ""}`} />
        <span>{deleteLoading ? "Deleting..." : "Delete"}</span>
      </motion.button>
    </motion.div>
  );

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
          transition: { duration: 1, ease: "easeOut" },
        }}
      />

      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center justify-center 
            w-10 h-10 sm:w-11 sm:h-11 rounded-full 
            bg-white/80 hover:bg-white backdrop-blur-sm 
            border border-gray-200/50 shadow-sm hover:shadow-md 
            transition-all duration-300 focus:outline-none active:scale-95"
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
              w-10 h-10 sm:w-11 sm:h-11 rounded-full 
              bg-white/80 hover:bg-white backdrop-blur-sm 
              border border-gray-200/50 shadow-sm hover:shadow-md 
              transition-all duration-300 focus:outline-none active:scale-95"
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isLiked
                  ? "text-red-500 fill-current"
                  : "text-gray-600 group-hover:text-red-400"
              }`}
            />
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center 
              w-10 h-10 sm:w-11 sm:h-11 rounded-full 
              bg-white/80 hover:bg-white backdrop-blur-sm 
              border border-gray-200/50 shadow-sm hover:shadow-md 
              transition-all duration-300 focus:outline-none active:scale-95"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-olive transition" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <motion.h1
          className="text-4xl font-bold text-olive tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {recipeTitle}
        </motion.h1>

        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div className="flex items-center space-x-3">
            <UserAvatar authorInfo={authorInfo} />

            <div>
              <p className="text-olive font-semibold text-lg">
                {authorInfo?.name || "Foodigo Team"}
              </p>
              {isOwner && (
                <p className="text-gray-500 text-sm">Recipe Creator</p>
              )}
            </div>
          </motion.div>

          {ownerActionsButton}
        </motion.div>

        <motion.div className="flex flex-wrap gap-3">
          {recipeVideoTutorial && (
            <motion.a
              href={recipeVideoTutorial}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 rounded-full
                bg-white text-olive space-x-2 hover:bg-gray-50 
                transition-colors shadow-sm hover:shadow-md
                border border-olive/10"
            >
              <Video className="w-4 h-4" />
              <span>Watch Tutorial</span>
            </motion.a>
          )}
          {recipeCategories && (
            <motion.div
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 rounded-full
                bg-white text-olive space-x-2 hover:bg-gray-50 
                transition-colors shadow-sm hover:shadow-md
                border border-olive/10"
            >
              <Map className="w-4 h-4" />
              <span className="text-olive font-medium">{categoryNames}</span>
            </motion.div>
          )}
          {area?.data?.name && (
            <motion.div
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm 
                rounded-full px-4 py-2 shadow-sm border border-olive/10"
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="w-5 h-5 text-olive" />
              <span className="text-olive font-medium">{area.data.name}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecipeHeader;

const RecipeHeaderSkeleton = () => (
  <div className="relative overflow-hidden animate-pulse">
    {/* Image skeleton */}
    <div className="w-full h-[400px] bg-gray-200" />

    {/* Top Navigation skeleton */}
    <div className="absolute top-4 left-4 right-4 flex justify-between">
      <div className="w-11 h-11 rounded-full bg-white/80" />
      <div className="flex space-x-2">
        <div className="w-11 h-11 rounded-full bg-white/80" />
        <div className="w-11 h-11 rounded-full bg-white/80" />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="p-6 space-y-4">
      {/* Title skeleton */}
      <div className="h-10 bg-gray-200 rounded-lg w-3/4" />

      {/* Author info skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-3">
        <div className="h-10 bg-gray-200 rounded-full w-32" />
        <div className="h-10 bg-gray-200 rounded-full w-40" />
        <div className="h-10 bg-gray-200 rounded-full w-36" />
      </div>
    </div>
  </div>
);

const UserAvatar = ({ authorInfo }) => {
  return (
    <Avatar
      src={authorInfo?.ProfilePicURL || undefined}
      style={{
        backgroundColor: !authorInfo?.ProfilePicURL ? "#5d6544" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={`shadow-sm ${
        authorInfo?.ProfilePicURL ? "border-2 border-[#5d6544]" : ""
      }`}
      size={40}
    >
      {authorInfo?.name ? authorInfo.name.charAt(0).toUpperCase() : "F"}
    </Avatar>
  );
};

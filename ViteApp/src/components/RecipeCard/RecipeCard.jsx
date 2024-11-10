import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const getTagColors = (categoryName) => {
  switch (categoryName?.toLowerCase()) {
    case "vegetarian":
      return "bg-[#F0F5C4] text-[#59871f]";
    case "breakfast":
      return "bg-[#EFEDFA] text-[#3C3A8F]";
    case "seafood":
      return "bg-[#E8F5FA] text-[#397A9E]";
    case "dairy":
      return "bg-[#FFF7D4] text-[#C99C0D]";
    case "dessert":
      return "bg-[#FFE6F0] text-[#D81B60]";
    case "snack":
      return "bg-[#FFF3E0] text-[#E65100]";
    case "meat":
      return "bg-[#F9E0E0] text-[#C62828]";
    case "vegan":
      return "bg-[#E0F4E0] text-[#388E3C]";
    default:
      return "bg-[#FFE5E5] text-[#FF4646]";
  }
};

export const RecipeCard = ({ recipe, index, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [categoryNames, setCategoryNames] = useState([]);

  useEffect(() => {
    const getCategoryNames = () => {
      try {
        const storedCategories = JSON.parse(
          localStorage.getItem("categories") || "[]"
        );

        // Handle both single category ID and array of category IDs
        const categoryIds = Array.isArray(recipe.categories)
          ? recipe.categories
          : [recipe.categories];

        // Find matching categories and extract their names
        const names = categoryIds
          .map((categoryId) => {
            const category = storedCategories.find(
              (cat) => cat._id === categoryId
            );
            return category?.name || "Unknown";
          })
          .filter(Boolean);

        setCategoryNames(names);
      } catch (error) {
        console.error("Error fetching category names:", error);
        setCategoryNames(["Unknown"]);
      }
    };

    getCategoryNames();
  }, [recipe.categories]);

  const handleLike = (e) => {
    e.stopPropagation();
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    toast.success(newIsLiked ? "Added To Favorites" : "Removed From Favorites");

    if (onLike) {
      onLike(recipe.idMeal, newIsLiked);
    }
  };

  return (
    <>
      <div
        className="w-full sm:max-w-xs lg:max-w-[22rem] shadow-sm mx-auto sm:mx-0 
        bg-white rounded-2xl sm:rounded-3xl overflow-hidden
        transition-all duration-500 ease-out cursor-pointer relative
        active:scale-98 sm:hover:-translate-y-2 sm:hover:shadow-xl
        touch-manipulation select-none group"
        style={{
          animationDelay: `${index * 100}ms`,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Shine effect overlay - only on desktop */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 duration-700 hidden sm:block">
          <div
            className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] 
            bg-gradient-to-r from-transparent via-white/20 to-transparent duration-1000 
            transform transition-transform"
          />
        </div>

        {/* Image container */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20 z-10" />
          <img
            className="w-full h-40 sm:h-48 object-cover transform transition-transform duration-700 
            sm:group-hover:scale-110"
            src={recipe.recipeImage}
            alt={recipe.recipeTitle}
            loading="lazy"
          />

          <button
            onClick={handleLike}
            aria-label={isLiked ? "Unlike recipe" : "Like recipe"}
            className="absolute top-3 right-3 z-20 p-3 sm:p-2.5
                     rounded-full bg-white/90 backdrop-blur-sm
                     active:scale-90 transition-all duration-300
                     shadow-sm hover:shadow-md
                     sm:opacity-0 sm:group-hover:opacity-100 
                     touch-manipulation"
          >
            <svg
              className={`w-5 h-5 sm:w-4 sm:h-4 ${
                isLiked ? "text-red-500 fill-current" : "text-gray-700"
              }`}
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Content section */}
        <div className="px-4 pt-4 pb-5 sm:pb-6">
          <h2
            className="text-lg sm:text-xl lg:text-2xl text-[#2C2C2C] tracking-tight font-normal 
            leading-snug line-clamp-2 sm:group-hover:translate-x-2 
            transition-transform duration-300"
          >
            {recipe.recipeTitle}
          </h2>

          <div className="flex flex-wrap gap-2 mt-4 items-center">
            {categoryNames.map((categoryName, idx) => (
              <span
                key={`${categoryName}-${idx}`}
                className={`${getTagColors(categoryName)} 
                py-2 px-4 sm:py-3 sm:px-6 rounded-full 
                uppercase tracking-widest text-[10px] sm:text-xs font-semibold
                transform transition-all duration-500 
                active:scale-95 sm:group-hover:scale-105 
                sm:hover:shadow-md`}
              >
                {categoryName}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeCard;

// RecipeCard.jsx
import React from "react";

const getTagColors = (category) => {
  switch (category) {
    case "Vegetarian":
      return "bg-[#F0F5C4] text-[#59871f]";
    case "Breakfast":
      return "bg-[#EFEDFA] text-[#3C3A8F]";
    case "Seafood":
      return "bg-[#E8F5FA] text-[#397A9E]";
    default:
      return "bg-[#FFE5E5] text-[#FF4646]";
  }
};

export const RecipeCard = ({ recipe, index }) => {
  return (
    <div
      className="max-w-xs transition-all duration-300 lg:max-w-[22rem] shadow-sm mx-auto sm:mx-0 border bg-white rounded-3xl hover:shadow-md cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-6">
        <img
          className="rounded-3xl w-full h-48 object-cover"
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
        />
      </div>
      <div className="px-4 pb-6">
        <h2 className="mb-1 text-[#2C2C2C] text-xl lg:text-2xl tracking-tight font-normal">
          {recipe.strMeal}
        </h2>
        <div className="flex gap-2 my-6 items-center">
          <span
            className={`${getTagColors(
              recipe.strCategory
            )} mr-auto py-3 px-6 rounded-full uppercase tracking-widest text-xs font-semibold`}
          >
            {recipe.strCategory}
          </span>
        </div>
      </div>
    </div>
  );
};

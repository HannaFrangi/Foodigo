import ChefHatSpinner from "/src/utils/ChefHatSpinner";
import React from "react";

const RecipeDetailsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <ChefHatSpinner size={64} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Cooking up your recipe...
        </h2>
        <p className="text-gray-500">
          Gathering ingredients, warming up the stove, and preparing to dazzle
          your taste buds!
        </p>
      </div>
    </div>
  );
};

export default RecipeDetailsLoading;

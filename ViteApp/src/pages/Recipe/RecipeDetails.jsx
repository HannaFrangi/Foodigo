import { Spin } from "antd";
import useGetRecipeById from "./../../hooks/useGetRecipebyId";
import React from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const { Recipe, loading, error } = useGetRecipeById(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-20 text-lg">
        Error: {error.message || "Something went wrong."}
      </div>
    );
  }

  if (!Recipe || !Recipe.data) {
    return (
      <div className="text-gray-500 text-center mt-20 text-lg">
        Recipe not found.
      </div>
    );
  }

  const {
    recipeTitle,
    recipeIngredients,
    recipeImage,
    recipeVideoTutorial,
    recipeInstructions,
    categories,
  } = Recipe.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Recipe Image */}
        <img
          src={recipeImage}
          alt={recipeTitle}
          className="w-full h-80 object-cover"
        />

        {/* Recipe Content */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b pb-2">
            {recipeTitle}
          </h1>

          {/* Ingredients */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipeIngredients.map((ingredient) => (
                <li
                  key={ingredient._id}
                  className="text-gray-600 text-lg flex items-center"
                >
                  <span className="font-medium">{ingredient.quantity}</span>
                  <span className="ml-2">- {ingredient.ingredientName}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Instructions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {recipeInstructions}
            </p>
          </section>

          {/* Video Tutorial */}
          {recipeVideoTutorial && (
            <section className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Video Tutorial
              </h2>
              <a
                href={recipeVideoTutorial}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition"
              >
                Watch the Tutorial
              </a>
            </section>
          )}

          {/* Categories */}
          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3 mt-2">
              {categories.map((categoryId, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow text-sm font-medium"
                >
                  {categoryId}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;

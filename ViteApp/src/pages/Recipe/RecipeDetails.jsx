import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecipeHeader } from "../../components/RecipeDetails/RecipeHeader";
import { IngredientsSection } from "../../components/RecipeDetails/IngredientsSection";
import { InstructionsSection } from "../../components/RecipeDetails/InstructionsSection";
import { ReviewSection } from "../../components/RecipeDetails/ReviewSection";

import useGetRecipeById from "../../hooks/useGetRecipebyId";
import useGetIngredientNamesById from "../../hooks/useGetIngredientNameById";
import useGetUserInfoById from "../../hooks/useGetUserInfoById";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";

const RecipeDetails = () => {
  const { id } = useParams();
  const [processedIngredients, setProcessedIngredients] = useState([]);

  const {
    Recipe,
    loading: recipeLoading,
    error: recipeError,
  } = useGetRecipeById(id);

  const {
    ingredientNames,
    loading: ingredientsLoading,
    error: ingredientsError,
    fetchIngredientNamesByIds,
  } = useGetIngredientNamesById();

  const {
    userInfo: authorInfo,
    isLoading: authorLoading,
    error: authorError,
  } = useGetUserInfoById(Recipe?.data?.userId);

  useEffect(() => {
    if (Recipe?.data?.recipeIngredients) {
      const ingredientIds = Recipe.data.recipeIngredients.map(
        (ingredient) => ingredient.ingredientName
      );
      if (ingredientIds.length > 0) {
        fetchIngredientNamesByIds(ingredientIds);
      }
    }
  }, [Recipe, fetchIngredientNamesByIds]);

  useEffect(() => {
    if (
      Recipe?.data?.recipeIngredients &&
      Object.keys(ingredientNames).length > 0
    ) {
      const processed = Recipe.data.recipeIngredients.map((ingredient) => ({
        ...ingredient,
        fullName: ingredientNames[ingredient.ingredientName] || "Unknown",
      }));
      setProcessedIngredients(processed);
    }
  }, [Recipe, ingredientNames]);

  if (recipeLoading || ingredientsLoading || authorLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ChefHatSpinner />
      </div>
    );
  }

  if (recipeError || ingredientsError || authorError) {
    return <div className="text-olive-600">Error loading recipe</div>;
  }

  if (!Recipe || !Recipe.data) {
    return <div className="text-olive-600">Recipe not found.</div>;
  }

  const { recipeTitle, recipeImage, recipeInstructions, reviews } = Recipe.data;

  const recipeSteps = recipeInstructions
    .split(".")
    .filter((step) => step.trim())
    .map((step, index) => ({
      title: `Step ${index + 1}`,
      description: step.trim() + ".",
    }));

  return (
    <div className="bg-olive-50 min-h-screen pt-8 pb-12 text-olive-700">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <RecipeHeader
          recipeTitle={recipeTitle}
          recipeImage={recipeImage}
          authorInfo={authorInfo}
        />
        <div className="p-6 space-y-6">
          <IngredientsSection ingredients={processedIngredients} />
          <InstructionsSection instructions={recipeSteps} />
          <ReviewSection reviews={reviews} recipeId={id} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;

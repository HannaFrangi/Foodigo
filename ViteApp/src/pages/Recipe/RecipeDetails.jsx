import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecipeHeader } from "../../components/RecipeDetails/RecipeHeader";
import { IngredientsSection } from "../../components/RecipeDetails/IngredientsSection";
import { InstructionsSection } from "../../components/RecipeDetails/InstructionsSection";
import { ReviewSection } from "../../components/RecipeDetails/ReviewSection";
import RecipeDetailsLoading from "../../components/RecipeDetails/RecipeDetailsLoading";
import useGetRecipeById from "../../hooks/useGetRecipebyId";
import useGetIngredientNamesById from "../../hooks/useGetIngredientNameById";
import useGetUserInfoById from "../../hooks/useGetUserInfoById";
import { useAuthStore } from "/src/store/useAuthStore"; // Assuming you have this hook to get auth user

const RecipeDetails = () => {
  const { id } = useParams();
  const [processedIngredients, setProcessedIngredients] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { authUser } = useAuthStore(); // Get the authenticated user from the store

  const {
    Recipe,
    loading: recipeLoading,
    error: recipeError,
    fetchRecipeById, // Assuming the hook provides a refetch method
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

  useEffect(() => {
    if (Recipe?.data?.reviews) {
      setReviews(Recipe.data.reviews);
    }
  }, [Recipe]);

  const handleReviewAdded = (newReview) => {
    setReviews((prevReviews) => {
      const existingReviewIndex = prevReviews.findIndex(
        (review) => review.user === authUser?._id
      );
      if (existingReviewIndex !== -1) {
        // Update the existing review
        const updatedReviews = [...prevReviews];
        updatedReviews[existingReviewIndex] = {
          ...updatedReviews[existingReviewIndex],
          ...newReview,
        };
        return updatedReviews;
      } else {
        // Add a new review
        return [...prevReviews, { ...newReview, user: authUser?._id }];
      }
    });
  };

  if (recipeLoading || ingredientsLoading || authorLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RecipeDetailsLoading />
      </div>
    );
  }

  if (recipeError || ingredientsError || authorError) {
    return <div className="text-olive">Error loading recipe</div>;
  }

  if (!Recipe || !Recipe.data) {
    return <div className="text-olive">Recipe not found.</div>;
  }

  const { recipeTitle, recipeImage, recipeInstructions, area } = Recipe.data;

  const recipeSteps = recipeInstructions
    .split(".")
    .filter((step) => step.trim())
    .map((step, index) => ({
      title: `Step ${index + 1}`,
      description: step.trim() + ".",
    }));

  return (
    <div className="min-h-screen pt-8 pb-12 text-olive">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <RecipeHeader
          recipeTitle={recipeTitle}
          recipeImage={recipeImage}
          authorInfo={authorInfo}
          recipeId={id}
          recipeArea={area}
        />
        <div className="p-6 space-y-6">
          <IngredientsSection ingredients={processedIngredients} />
          <InstructionsSection instructions={recipeSteps} />
          <ReviewSection
            reviews={reviews}
            recipeId={id}
            onReviewAdded={handleReviewAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;

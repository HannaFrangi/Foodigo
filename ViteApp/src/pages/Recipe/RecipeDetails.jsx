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

import useGetReviewsById from "../../hooks/useGetReviewsById"; // Import the reviews hook

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
    window.scrollTo(0, 0); // Scroll to top on page load
  }, []);

  // Fetch reviews inside this component using the `id` param
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useGetReviewsById(id); // Fetch reviews for the recipe using its ID

  useEffect(() => {
    if (Recipe?.data?.recipeIngredients) {
      const ingredientIds = Recipe.data.recipeIngredients.map(
        (ingredient) => ingredient.ingredientName
      );
      if (ingredientIds.length > 0) {
        fetchIngredientNamesByIds(ingredientIds);
        document.title = `Recipe | ${Recipe?.data?.recipeTitle} 👩‍🍳`;
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

  if (recipeLoading || ingredientsLoading || authorLoading || reviewsLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <RecipeDetailsLoading />
      </div>
    );
  }

  if (recipeError || ingredientsError || authorError || reviewsError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] p-8'>
        <div className='bg-red-50 rounded-lg p-8 shadow-sm border border-red-100 max-w-md'>
          <div className='text-red-500 justify-center text-5xl mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16 animate-bounce mx-auto'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-bold text-gray-800 mb-2'>
            Oops! Something went wrong
          </h3>
          <p className='text-gray-600'>
            We're having trouble loading this recipe. Please try again later.
          </p>
        </div>
      </div>
    );
  } //Majd

  if (!Recipe || !Recipe.data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] p-8'>
        <div className='bg-amber-50 rounded-lg p-8 shadow-sm border border-amber-100 max-w-md'>
          <div className='text-amber-500 text-5xl mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.172 16.172a4 4 0 015.656 0M12 14a3 3 0 100-6 3 3 0 000 6z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-bold text-gray-800 mb-2'>
            Recipe Not Found
          </h3>
          <p className='text-gray-600'>
            The recipe you're looking for doesn't exist or may have been
            removed.
          </p>
        </div>
      </div>
    );
  } //Majd

  const {
    recipeTitle,
    recipeImage,
    recipeInstructions,
    area,
    recipeVideoTutorial,
    categories,
  } = Recipe.data;

  const recipeSteps = recipeInstructions
    .split(".")
    .filter((step) => step.trim())
    .map((step, index) => ({
      title: `Step ${index + 1}`,
      description: step.trim() + ".",
    }));

  return (
    <div className='min-h-screen pt-8 pb-12 text-olive'>
      <div className='max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden'>
        <RecipeHeader
          recipeTitle={recipeTitle}
          recipeImage={recipeImage}
          authorInfo={authorInfo}
          recipeId={id}
          recipeArea={area}
          recipeVideoTutorial={recipeVideoTutorial}
          recipeCategories={categories}
        />
        <div className='p-6 space-y-6'>
          <IngredientsSection ingredients={processedIngredients} />
          <InstructionsSection instructions={recipeSteps} />
          {/* Pass only the id prop to ReviewSection */}
          <ReviewSection recipeId={id} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;

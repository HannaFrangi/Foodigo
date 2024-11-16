import React, { useState, useEffect, useRef } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
import RecipeCardSkeleton from "../RecipeCard/RecipeCardSkeleton";
import { useRecipeStore } from "/src/store/useRecipeStore";
import { gsap } from "gsap";

const LatestRecipe = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const { LatestRecipe, recipes, fetchCategories, categories } =
    useRecipeStore();

  // Reference for the title
  const titleRef = useRef(null);

  useEffect(() => {
    LatestRecipe();
    fetchCategories();
  }, [LatestRecipe, fetchCategories]);

  // GSAP text reveal animation
  useEffect(() => {
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, []);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCardsPerPage = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  // Get recipes data from store and enhance with category names
  const recipeData =
    recipes?.data?.map((recipe) => {
      const categoryNames = recipe.categories
        ?.map((catId) => categories[catId] || "Unknown")
        .filter(Boolean);

      return {
        ...recipe,
        categoryNames,
      };
    }) || [];

  const cardsPerPage = getCardsPerPage();
  const totalPages = Math.ceil(recipeData.length / cardsPerPage);

  const autoPlay = true;
  const autoPlayInterval = 5000;

  useEffect(() => {
    let timer;
    if (autoPlay && !isAnimating && recipeData.length > 0) {
      timer = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }
    return () => clearInterval(timer);
  }, [currentPage, isAnimating, recipeData.length]);

  const handleNext = () => {
    if (totalPages <= 1 || isAnimating) return; // Prevent if there's only one page or if already animating
    setIsAnimating(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsAnimating(false), 500); // End animation after 500ms
  };

  const handlePrev = () => {
    if (totalPages <= 1 || isAnimating) return;
    setIsAnimating(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Group recipes into pages
  const recipePages = recipeData.reduce((acc, recipe, index) => {
    const pageIndex = Math.floor(index / cardsPerPage);
    if (!acc[pageIndex]) {
      acc[pageIndex] = [];
    }
    acc[pageIndex].push(recipe);
    return acc;
  }, []);

  // Render loading skeleton or actual data
  const renderLoadingState = (
    <div className="w-full py-6 md:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-center items-center h-64 m-auto space-x-4">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      </div>
    </div>
  );

  // No recipes state
  const renderNoRecipesState = (
    <div className="w-full py-6 md:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">No recipes available</div>
        </div>
      </div>
    </div>
  );

  // If recipes are loading or there's no data, show the skeleton or no recipes message
  if (!recipes || !recipes.data) {
    return (
      <>
        <div className="w-full py-6 md:py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2
                ref={titleRef}
                className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
              >
                Latest Recipes
              </h2>
            </div>
            {renderLoadingState}
          </div>
        </div>
      </>
    );
  }

  // If there are no recipes
  if (recipeData.length === 0) {
    return (
      <div className="w-full py-6 md:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2
              ref={titleRef}
              className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
            >
              Latest Recipes
            </h2>
          </div>
          {renderNoRecipesState}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 md:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2
            ref={titleRef}
            className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
          >
            Latest Recipes
          </h2>
          <div className="hidden md:flex space-x-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`transition-all duration-300 h-3 rounded-full ${
                  index === currentPage
                    ? "w-8 bg-olive"
                    : "w-3 bg-gray-300 hover:bg-olive"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative px-0 md:px-4">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {recipePages.map((page, pageIndex) => (
                <div key={pageIndex} className="flex gap-4 md:gap-6 min-w-full">
                  {page.map((recipeData) => (
                    <RecipeCard key={recipeData._id} recipe={recipeData} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute -left-3 md:-left-12 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all transform hover:scale-110 focus:outline-none"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute -right-3 md:-right-12 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all transform hover:scale-110 focus:outline-none"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Pagination dots */}
        <div className="md:hidden flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`transition-all duration-300 h-2 rounded-full ${
                index === currentPage
                  ? "w-4 bg-olive"
                  : "w-3 bg-gray-300 hover:bg-olive"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestRecipe;

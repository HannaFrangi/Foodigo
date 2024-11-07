import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChefHat, Clock, Users } from "lucide-react";
import RecipeCard from "../RecipeCard/RecipeCard";

const LatestRecipe = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const sampleRecipes = [
    {
      id: 1,
      strMeal: "Mediterranean Salad",
      strCategory: "Vegetarian",
      strMealThumb:
        "https://cdn.loveandlemons.com/wp-content/uploads/2019/07/salad.jpg",
    },
    {
      id: 2,
      strMeal: "Grilled Salmon Salad",
      strCategory: "Seafood",
      strMealThumb:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyi0ndisrU17sVM0cWvkv8x0eLBKNWC54Jww&s",
    },
    {
      id: 3,
      strMeal: "Avocado Toast",
      strCategory: "Breakfast",
      strMealThumb:
        "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-french-toast%2Ffrench-toast-COMP",
    },
    {
      id: 4,
      strMeal: "XXXXXX",
      strCategory: "Breakfast",
      strMealThumb:
        "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-french-toast%2Ffrench-toast-COMP",
    },
    {
      id: 5,
      strMeal: "Majd Chbat",
      strCategory: "LF",
      strMealThumb:
        "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-french-toast%2Ffrench-toast-COMP",
    },
    {
      id: 6,
      strMeal: "XXXXXX",
      strCategory: "XXXXXXXXXXXXXXXXXXXX",
      strMealThumb:
        "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-french-toast%2Ffrench-toast-COMP",
    },
  ];

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

  const cardsPerPage = getCardsPerPage();
  const totalPages = Math.ceil(sampleRecipes.length / cardsPerPage);

  const autoPlay = true;
  const autoPlayInterval = 5000;

  useEffect(() => {
    let timer;
    if (autoPlay && !isAnimating) {
      timer = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }
    return () => clearInterval(timer);
  }, [currentPage, isAnimating]);

  const handleNext = () => {
    setIsAnimating(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const recipePages = sampleRecipes.reduce((acc, recipe, index) => {
    const pageIndex = Math.floor(index / cardsPerPage);
    if (!acc[pageIndex]) {
      acc[pageIndex] = [];
    }
    acc[pageIndex].push(recipe);
    return acc;
  }, []);

  return (
    <div className="w-full py-6 md:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
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
                  {page.map((sampleRecipes) => (
                    <RecipeCard recipe={sampleRecipes} key={sampleRecipes.id} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
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
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-4 md:hidden">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`transition-all duration-300 h-2 rounded-full ${
                index === currentPage ? "w-6 bg-olive" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestRecipe;

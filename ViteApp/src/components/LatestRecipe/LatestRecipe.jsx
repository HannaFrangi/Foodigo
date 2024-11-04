import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Users, ChefHat } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const LatestRecipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const recipes = [
    {
      id: 1,
      title: "Creamy Garlic Pasta",
      chef: "Chef Maria",
      time: "30 min",
      servings: 4,
      difficulty: "Easy",
      image: "/images/recipe1.jpg", // Replace with actual image path
    },
    // ...other recipes
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === recipes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Recipes</h2>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-[#5d6544]/10 hover:bg-[#5d6544]/20 text-[#5d6544]"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-[#5d6544]/10 hover:bg-[#5d6544]/20 text-[#5d6544]"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            <div className="flex flex-nowrap min-w-full gap-6">
              {recipes.map((recipe, index) => (
                <Card
                  key={recipe.id}
                  className={`flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] shadow-md hover:shadow-lg transition-shadow duration-300
                    ${
                      index === currentIndex
                        ? "border-[#5d6544]/20"
                        : "border-gray-200"
                    }`}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600">{recipe.chef}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChefHat className="h-4 w-4" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-2 mt-4 md:hidden">
          {recipes.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-4 bg-[#5d6544]"
                  : "w-2 bg-[#5d6544]/20"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestRecipe;

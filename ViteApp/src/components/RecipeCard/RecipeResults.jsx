import { useRecipeStore } from "/src/store/useRecipeStore";
import React, { useRef } from "react";
import { RecipeCard } from "./RecipeCard";
import { ChefHat } from "lucide-react";

const RecipeResults = () => {
  const { SearchResults, Searching, hasSearched } = useRecipeStore();
  const containerRef = useRef(null);

  if (!Searching && hasSearched && SearchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="mx-auto h-12 w-12 text-[#606848] mb-4" />
        <h3 className="text-lg font-medium text-[#606848]">No recipes found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search terms or browse our categories
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {SearchResults.map((recipe, index) => (
        <RecipeCard key={recipe._id} recipe={recipe} index={index} />
      ))}
    </div>
  );
};

export default RecipeResults;

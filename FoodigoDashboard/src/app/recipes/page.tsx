"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { Loader, UserCircle, X, Search, Star, Book } from "lucide-react";
import debounce from "lodash/debounce";

interface Ingredient {
  ingredientName: string;
  quantity: string;
  _id: string;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
  _id: string;
  date: string;
}

interface Recipe {
  _id: string;
  recipeTitle: string;
  recipeImage: string;
  recipeInstructions: string;
  recipeIngredients: Ingredient[];
  recipeVideoTutorial: string;
  area: string;
  reviews: Review[];
  categories: string[];
  userId: {
    name: string;
    ProfilePicURL?: string;
  };
  createdAt: string;
}

async function getRecipes() {
  try {
    const response = await fetch("http://localhost:5001/api/admin/recipes", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return (await response.json()).data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function searchRecipes(query: string) {
  try {
    const response = await fetch(
      `https://localhost:5001/api/admin/recipes/search?recipeTitle=${encodeURIComponent(query)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return (await response.json()).data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function updateRecipe(id: string, data: Partial<Recipe>) {
  const response = await fetch(
    `https://localhost:5001/api/admin/recipes/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return response.json();
}

const RecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState<Partial<Recipe>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        toast.error("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim()) {
      setSearchLoading(true);
      try {
        const searchResults = await searchRecipes(query);
        // Ensure we're setting a valid array of recipes
        setRecipes(Array.isArray(searchResults) ? searchResults : []);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Search failed");
        setRecipes([]); // Reset to empty array on error
      } finally {
        setSearchLoading(false);
      }
    } else {
      try {
        const data = await getRecipes();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch recipes");
        setRecipes([]); // Reset to empty array on error
      }
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setEditedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedRecipe?._id) return;
      await updateRecipe(selectedRecipe._id, editedRecipe);
      setRecipes(
        recipes.map((recipe) =>
          recipe._id === selectedRecipe._id
            ? { ...recipe, ...editedRecipe }
            : recipe,
        ),
      );
      setIsModalOpen(false);
      toast.success("Recipe updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (!mounted) return null;
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Recipes</h2>
            <div className="relative w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {searchLoading ? (
                  <Loader className="h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  <Search className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {recipes.length === 0 ? (
              <div className="text-center text-gray-500">
                No recipes found matching your search.
              </div>
            ) : (
              recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="flex cursor-pointer items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={recipe.recipeImage || "/api/placeholder/64/64"}
                      alt={recipe.recipeTitle}
                      className="object-cover"
                      width={64}
                      height={64}
                      priority
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {recipe.recipeTitle}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="relative h-6 w-6 overflow-hidden rounded-full">
                        {recipe.userId?.ProfilePicURL ? (
                          <Image
                            src={recipe.userId.ProfilePicURL}
                            alt={recipe.userId.name || "User"}
                            className="object-cover"
                            width={24}
                            height={24}
                            priority
                          />
                        ) : (
                          <UserCircle className="h-6 w-6" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Created by {recipe.userId?.name || "Unknown User"}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{recipe.reviews?.length || 0} reviews</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Book className="h-4 w-4" />
                        <span>
                          {recipe.recipeIngredients?.length || 0} ingredients
                        </span>
                      </div>
                    </div>
                  </div>
                  <time className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(recipe.createdAt), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedRecipe && (
        <div className="z-100 fixed inset-0 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recipe Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6">
                {/* Recipe Image */}
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={
                      selectedRecipe.recipeImage || "/api/placeholder/400/320"
                    }
                    alt={selectedRecipe.recipeTitle}
                    className="object-cover"
                    fill
                    priority
                  />
                </div>

                {/* Basic Info */}
                <div>
                  <h4 className="text-xl font-semibold">
                    {selectedRecipe.recipeTitle}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    by {selectedRecipe.userId.name}
                  </p>
                </div>

                {/* Ingredients */}
                <div>
                  <h5 className="mb-2 font-medium">Ingredients</h5>
                  <ul className="list-inside list-disc space-y-1">
                    {selectedRecipe.recipeIngredients?.map((ingredient) => (
                      <li key={ingredient._id} className="text-sm">
                        {ingredient.quantity} {ingredient.ingredientName}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h5 className="mb-2 font-medium">Instructions</h5>
                  <p className="whitespace-pre-line text-sm">
                    {selectedRecipe.recipeInstructions}
                  </p>
                </div>

                {/* Reviews */}
                <div>
                  <h5 className="mb-2 font-medium">
                    Reviews ({selectedRecipe.reviews?.length || 0})
                  </h5>
                  <div className="space-y-3">
                    {selectedRecipe.reviews?.map((review) => (
                      <div
                        key={review._id}
                        className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(review.date), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Tutorial Link */}
                {selectedRecipe.recipeVideoTutorial && (
                  <div>
                    <h5 className="mb-2 font-medium">Video Tutorial</h5>
                    <a
                      href={selectedRecipe.recipeVideoTutorial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Watch tutorial
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeList;

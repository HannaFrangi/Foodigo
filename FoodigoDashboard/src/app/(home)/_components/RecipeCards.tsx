"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const RecipeList = () => {
  const recipes = [
    {
      _id: "6782bddf24b7dbc647c5e7d0",
      recipeTitle: "15-minute chicken & halloumi burgers",
      recipeImage:
        "https://firebasestorage.googleapis.com/v0/b/hdarne-3d2b6.appspot.com/o/recipes%2F1736621532819_15-minute_chicken_%26_halloumi_burgers.jpg?alt=media&token=3aa4b082-07d2-416c-8a20-21c50a0a43f6",
      userId: "675afaab143c11f684324a06",
      createdAt: "2025-01-11T18:52:15.840Z",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Latest Recipes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="flex items-center space-x-4 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image
                  src="/api/placeholder/64/64"
                  alt={recipe.recipeTitle}
                  className="object-cover"
                  width={64}
                  height={64}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {recipe.recipeTitle}
                </p>
                <p className="text-sm text-gray-500">
                  Created by User {recipe.userId.slice(-6)}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(recipe.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeList;

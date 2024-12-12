import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Input, Textarea, Button, Checkbox } from "@nextui-org/react";
import { useRecipeStore } from "../../store/useRecipeStore";
import { useAuthStore } from "../../store/useAuthStore";

const AddRecipe = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { categories, addRecipe, fetchCategories } = useRecipeStore();

  const [formData, setFormData] = useState({
    recipeTitle: "",
    recipeBio: "",
    recipeOrigin: "",
    recipeVideoTutorial: "",
    categories: [],
    cookTime: "",
    servings: "",
    recipeIngredients: [{ ingredientName: "", quantity: "" }],
    recipeInstructions: "",
    recipeImage: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipeTitle.trim())
      newErrors.recipeTitle = "Recipe title is required";
    if (!formData.recipeBio.trim())
      newErrors.recipeBio = "Recipe description is required";
    if (formData.categories.length === 0)
      newErrors.categories = "Please select at least one category";
    if (!formData.recipeInstructions.trim())
      newErrors.recipeInstructions = "Instructions are required";

    formData.recipeIngredients.forEach((ingredient, index) => {
      if (!ingredient.ingredientName.trim()) {
        if (!newErrors.recipeIngredients) newErrors.recipeIngredients = [];
        newErrors.recipeIngredients[index] = "Ingredient name is required";
      }
      if (!ingredient.quantity.trim()) {
        if (!newErrors.recipeIngredients) newErrors.recipeIngredients = [];
        newErrors.recipeIngredients[index] = "Ingredient quantity is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      toast.error("You must be logged in to add a recipe");
      return;
    }

    if (validateForm()) {
      try {
        const recipeFormData = new FormData();

        Object.keys(formData).forEach((key) => {
          if (key === "recipeIngredients") {
            recipeFormData.append(key, JSON.stringify(formData[key]));
          } else if (key === "categories") {
            recipeFormData.append(key, JSON.stringify(formData[key]));
          } else if (key === "recipeImage" && formData[key]) {
            recipeFormData.append(key, formData[key]);
          } else if (formData[key]) {
            recipeFormData.append(key, formData[key]);
          }
        });

        recipeFormData.append("userId", authUser._id);

        const response = await addRecipe(recipeFormData);

        if (response) {
          toast.success("Recipe added successfully!");
          navigate("/recipe");
        }
      } catch (error) {
        toast.error(error.message || "Failed to add recipe");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-olive-50">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-olive-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-olive-800">
          Add New Recipe
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <Input
            label="Recipe Title"
            variant="bordered"
            color="success"
            value={formData.recipeTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recipeTitle: e.target.value }))
            }
            className="w-full"
            isInvalid={!!errors.recipeTitle}
            errorMessage={errors.recipeTitle}
          />

          {/* Description Textarea */}
          <Textarea
            label="Recipe Description"
            variant="bordered"
            color="success"
            value={formData.recipeBio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recipeBio: e.target.value }))
            }
            className="w-full"
            isInvalid={!!errors.recipeBio}
            errorMessage={errors.recipeBio}
          />

          {/* Categories Selection */}
          <div>
            <p className="text-sm font-medium text-olive-700 mb-2">
              Select Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Checkbox
                  key={category._id}
                  color="success"
                  isSelected={formData.categories.includes(category._id)}
                  onValueChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      categories: prev.categories.includes(category._id)
                        ? prev.categories.filter((id) => id !== category._id)
                        : [...prev.categories, category._id],
                    }));
                  }}
                >
                  {category.name}
                </Checkbox>
              ))}
            </div>
            {errors.categories && (
              <p className="text-red-500 text-xs mt-1">{errors.categories}</p>
            )}
          </div>

          {/* Ingredients Dynamic Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-olive-800">
              Ingredients
            </h2>
            {formData.recipeIngredients.map((ingredient, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  variant="bordered"
                  label="Ingredient Name"
                  value={ingredient.ingredientName}
                  onChange={(e) => {
                    const newIngredients = [...formData.recipeIngredients];
                    newIngredients[index].ingredientName = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      recipeIngredients: newIngredients,
                    }));
                  }}
                  color="success"
                  className="flex-grow"
                />
                <Input
                  variant="bordered"
                  label="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => {
                    const newIngredients = [...formData.recipeIngredients];
                    newIngredients[index].quantity = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      recipeIngredients: newIngredients,
                    }));
                  }}
                  color="success"
                  className="w-1/3"
                />
              </div>
            ))}
          </div>

          {/* Instructions */}
          <Textarea
            label="Cooking Instructions"
            variant="bordered"
            color="success"
            value={formData.recipeInstructions}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                recipeInstructions: e.target.value,
              }))
            }
            className="w-full"
            isInvalid={!!errors.recipeInstructions}
            errorMessage={errors.recipeInstructions}
          />

          {/* Submit Button */}
          <Button
            color="success"
            variant="solid"
            type="submit"
            className="w-full bg-olive-700 text-white hover:bg-olive-800"
          >
            Add Recipe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;

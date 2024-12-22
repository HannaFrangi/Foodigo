import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Input, Textarea, Button, Tooltip } from "@nextui-org/react";
import { Plus, Trash2, Image, X, CopySlash } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import useAddRecipe from "/src/hooks/useAddRecipe";
import RecipeCat from "/src/components/AddRecipe/RecipeCat";
import RecipeIngrediant from "/src/components/AddRecipe/RecipeIngrediant";
import RecipeArea from "/src/components/AddRecipe/RecipeArea";

const AddRecipe = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { addRecipe, loading, error } = useAddRecipe();
  // const { area, fetchALlAreas } = useGetAllAreas();

  if (!authUser) {
    toast.error("You must be logged in to add a recipe");
    navigate("/");
  }

  const [formData, setFormData] = useState({
    recipeTitle: "",
    recipeBio: "",
    area: "",
    recipeVideoTutorial: "",
    categories: [],
    recipeIngredients: [{ ingredientName: "", quantity: "", unit: "" }],
    recipeInstructions: "",
    recipeImage: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      return;
    }

    if (validateForm()) {
      try {
        console.log(formData.recipeIngredients);
        const recipeData = {
          recipeTitle: formData.recipeTitle,
          recipeIngredients: formData.recipeIngredients.map((ingredient) => ({
            ingredientName: ingredient.ingredientId,
            quantity: `${ingredient.quantity} ${ingredient.unit}`.trim(),
          })),
          recipeImage: formData.recipeImage,
          recipeVideoTutorial: formData.recipeVideoTutorial,
          area: formData.area,
          recipeInstructions: formData.recipeInstructions,
          recipeBio: formData.recipeBio,
          userId: authUser._id,
          categories: formData.categories,
        };

        console.log(recipeData);

        await addRecipe(recipeData);
        toast.success("Recipe added successfully!");
        navigate("/recipe");
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to add recipe");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      setFormData((prev) => ({ ...prev, recipeImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, recipeImage: null }));
    setImagePreview(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border-2 border-olive/20 space-y-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-olive">
          Create a New Recipe
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Basics */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Recipe Title"
              variant="bordered"
              value={formData.recipeTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recipeTitle: e.target.value,
                }))
              }
              className="w-full"
              isInvalid={!!errors.recipeTitle}
              errorMessage={errors.recipeTitle}
            />

            <RecipeArea
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          </div>

          <Input
            label="Recipe Video Tutorial (Optional)"
            variant="bordered"
            value={formData.recipeVideoTutorial}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                recipeVideoTutorial: e.target.value,
              }))
            }
            className="w-full"
          />
          {/* Description */}
          <Textarea
            label="Recipe Description"
            variant="bordered"
            value={formData.recipeBio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recipeBio: e.target.value }))
            }
            className="w-full"
            isInvalid={!!errors.recipeBio}
            errorMessage={errors.recipeBio}
          />

          {/* Categories and Image */}
          <div className="grid md:grid-cols-2 gap-4">
            <RecipeCat
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
            {/* Image Upload */}
            <div className="my-5 ">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="recipe-image-upload"
                />
                <label
                  htmlFor="recipe-image-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-olive/30 rounded-lg cursor-pointer hover:bg-olive/5 transition-colors"
                >
                  <Image className="mr-2 text-olive" />
                  {imagePreview ? "Change Image" : "Upload Recipe Image"}
                </label>
                {imagePreview && (
                  <Tooltip content="Remove Image">
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </Tooltip>
                )}
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="max-w-full h-48 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          {/* Ingredients Dynamic Section */}
          <RecipeIngrediant
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          {/* Instructions */}
          <Textarea
            label="Cooking Instructions"
            variant="bordered"
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
            minRows={6}
          />

          {/* Submit Button */}
          <Button
            variant="solid"
            type="submit"
            className="w-full bg-olive text-white hover:bg-olive/90 transition-colors"
            onClick={handleSubmit}
            loading={loading}
          >
            Create Recipe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input, Button, Tooltip } from "@nextui-org/react";
import { Image, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import useAddRecipe from "/src/hooks/useAddRecipe";
import RecipeCat from "/src/components/AddRecipe/RecipeCat";
import RecipeIngrediant from "/src/components/AddRecipe/RecipeIngrediant";
import RecipeArea from "/src/components/AddRecipe/RecipeArea";
import RecipeInstructions from "/src/components/AddRecipe/RecipeInstructions";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";

const AddRecipe = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { addRecipe, loading } = useAddRecipe();
  // const { area, fetchALlAreas } = useGetAllAreas();

  if (!authUser) {
    toast.error("You must be logged in to add a recipe");
    navigate("/");
  }

  const [formData, setFormData] = useState({
    recipeTitle: "",
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
          userId: authUser._id,
          categories: formData.categories,
        };

        await addRecipe(recipeData);
        toast.success("Recipe added successfully!");
        // navigate("/recipe");
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
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
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
    <div className="container mx-auto px-4 py-8 min-h-screen">
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
          <RecipeInstructions
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          {/* Submit Button */}
          <Button
            variant="solid"
            type="submit"
            className="w-full bg-olive text-white hover:bg-olive/90 transition-colors flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <ChefHatSpinner size={30} /> : "Create Recipe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;

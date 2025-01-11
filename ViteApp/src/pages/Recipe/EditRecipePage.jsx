import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Input, Button, Upload, Tooltip, Spin } from "antd";
import { Image, X } from "lucide-react";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";
import useEditRecipe from "/src/hooks/useEditRecipe";
import { useAuthStore } from "/src/store/useAuthStore";
import useGetRecipeById from "/src/hooks/useGetRecipebyId";
import RecipeCat from "/src/components/AddRecipe/RecipeCat";
import RecipeInstructions from "/src/components/AddRecipe/RecipeInstructions";
import EditIngredient from "/src/components/EditRecipe/EditIngredient";
import EditArea from "/src/components/EditRecipe/EditArea";

export default function EditRecipePage() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [instructionsReady, setInstructionsReady] = useState(false);

  const [formData, setFormData] = useState({
    recipeTitle: "",
    area: "",
    recipeVideoTutorial: "",
    categories: [],
    recipeIngredients: [{ ingredientName: "", quantity: "", unit: "" }],
    recipeInstructions: "",
    recipeImage: null,
  });

  const { editRecipe, loading: editLoading } = useEditRecipe();
  const {
    Recipe: recipe,
    loading: recipeLoading,
    error: recipeError,
  } = useGetRecipeById(recipeId);

  useEffect(() => {
    if (recipe?.data) {
      setFormData({
        recipeTitle: recipe.data.recipeTitle || "",
        area: recipe.data.area || "",
        recipeVideoTutorial: recipe.data.recipeVideoTutorial || "",
        categories: recipe.data.categories || [],
        recipeIngredients: recipe.data.recipeIngredients || [],
        recipeInstructions: recipe.data.recipeInstructions || "",
        recipeImage: recipe.data.recipeImage || null,
      });
      setImagePreview(recipe.data.recipeImage);
      setInstructionsReady(true);
    }
  }, [recipe]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recipeTitle.trim())
      newErrors.recipeTitle = "Recipe title is required";
    if (!formData.recipeInstructions.trim())
      newErrors.recipeInstructions = "Instructions are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) return;

    if (validateForm()) {
      try {
        await editRecipe(recipeId, formData);
        toast.success("Recipe updated successfully!");
        navigate(`/recipe/${recipeId}`);
      } catch (err) {
        toast.error(err.message || "Failed to update recipe");
      }
    }
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      setFormData((prev) => ({ ...prev, recipeImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, recipeImage: null }));
    setImagePreview(null);
  };

  if (recipeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ChefHatSpinner />
      </div>
    );
  }

  if (recipeError) {
    toast.error("Failed to load recipe");
    navigate("/recipes");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border-2 border-olive/20 space-y-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-olive">
          Edit Recipe
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-olive">Recipe Title</p>
              <Input
                value={formData.recipeTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recipeTitle: e.target.value,
                  }))
                }
                status={errors.recipeTitle ? "error" : ""}
                className="w-full"
              />
              {errors.recipeTitle && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.recipeTitle}
                </p>
              )}
            </div>

            <EditArea
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-olive">
              Recipe Video Tutorial (Optional)
            </p>
            <Input
              value={formData.recipeVideoTutorial}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recipeVideoTutorial: e.target.value,
                }))
              }
              className="w-full"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <RecipeCat
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />

            <div className="my-5">
              <Upload
                accept="image/*"
                showUploadList={false}
                onChange={handleImageUpload}
              >
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-olive/30 rounded-lg cursor-pointer hover:bg-olive/5 transition-all ease-in-out duration-200">
                  <Image className="text-olive mb-2" size={32} />
                  <p className="text-sm text-olive font-medium">
                    {imagePreview
                      ? "Change Recipe Image"
                      : "Upload Recipe Image"}
                  </p>
                  <p className="text-xs text-gray-500">
                    (JPEG, PNG, GIF - Max size: 5MB)
                  </p>
                </div>
              </Upload>

              {imagePreview && (
                <div className="relative mt-4">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="w-full h-48 object-cover transition-transform hover:scale-105 duration-200"
                    />
                  </div>
                  <Tooltip title="Remove Image">
                    <Button
                      type="text"
                      danger
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white min-w-unit-8 h-unit-8 flex items-center justify-center rounded-full hover:bg-red-600 shadow-md"
                      icon={<X size={16} />}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          <EditIngredient
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          {instructionsReady && (
            <RecipeInstructions
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-olive text-white hover:bg-olive/90"
            disabled={editLoading}
          >
            {editLoading ? <Spin /> : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}

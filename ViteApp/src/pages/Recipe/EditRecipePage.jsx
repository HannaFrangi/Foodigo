import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "/src/store/useAuthStore";
import useEditRecipe from "/src/hooks/useEditRecipe";
import useGetRecipeById from "/src/hooks/useGetRecipebyId";
import toast from "react-hot-toast";

const EditRecipePage = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { editRecipe, loading, success, error } = useEditRecipe();
  const { recipe, fetchRecipeById } = useGetRecipeById();
  console.log(recipeId);
  const [formValues, setFormValues] = useState({
    title: "",
    image: "",
    area: "",
    videoTutorial: "",
    ingredients: [],
  });

  useEffect(() => {
    fetchRecipeById(recipeId);
  }, [recipeId, fetchRecipeById]);

  useEffect(() => {
    if (recipe) {
      setFormValues({
        title: recipe.title,
        image: recipe.image,
        area: recipe.area,
        videoTutorial: recipe.videoTutorial,
        ingredients: recipe.ingredients,
      });
    }
  }, [recipe]);

  useEffect(() => {
    if (success) {
      toast.success("Recipe updated successfully");
      navigate(`/recipe/${recipeId}`);
    }
    if (error) {
      toast.error(error.message || "Failed to update recipe");
    }
  }, [success, error, navigate, recipeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editRecipe(recipeId, formValues);
  };

  //   if (!authUser || authUser._id !== recipe?.authorId) {
  //     return <p>You are not authorized to edit this recipe.</p>;
  //   }
  console.log(recipe);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="text"
            name="image"
            value={formValues.image}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Area</label>
          <input
            type="text"
            name="area"
            value={formValues.area}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Video Tutorial URL</label>
          <input
            type="text"
            name="videoTutorial"
            value={formValues.videoTutorial}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Ingredients</label>
          <textarea
            name="ingredients"
            value={formValues.ingredients.join(", ")}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                ingredients: e.target.value.split(",").map((i) => i.trim()),
              })
            }
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-olive text-white rounded hover:bg-olive/90"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipePage;

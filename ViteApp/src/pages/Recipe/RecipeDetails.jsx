import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Link,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Steps } from "antd";
import { ChefHat, BookOpen, Video, Leaf, ArrowLeft, Plus } from "lucide-react";
import useGetRecipeById from "/src/hooks/useGetRecipebyId";
import useGetIngredientNamesByIds from "/src/hooks/useGetIngredientNameById";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";
import toast from "react-hot-toast";

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [processedIngredients, setProcessedIngredients] = useState([]);
  const [openPopoverId, setOpenPopoverId] = useState(null); // Track which popover is open

  const handleAddToGroceryList = (ingredient) => {
    // Add the ingredient to the grocery list (your actual logic here)
    toast.success(`Added ${ingredient.fullName} to the grocery list!`);

    // Close the popover after adding
    setOpenPopoverId(null);
  };

  const {
    Recipe,
    loading: recipeLoading,
    error: recipeError,
  } = useGetRecipeById(id);

  const {
    ingredientNames,
    loading: ingredientsLoading,
    error: ingredientsError,
    fetchIngredientNamesByIds,
  } = useGetIngredientNamesByIds();

  useEffect(() => {
    if (Recipe?.data?.recipeIngredients) {
      const ingredientIds = Recipe.data.recipeIngredients.map(
        (ingredient) => ingredient.ingredientName
      );
      if (ingredientIds.length > 0) {
        fetchIngredientNamesByIds(ingredientIds);
      }
    }
  }, [Recipe, fetchIngredientNamesByIds]);

  useEffect(() => {
    if (
      Recipe?.data?.recipeIngredients &&
      Object.keys(ingredientNames).length > 0
    ) {
      const processed = Recipe.data.recipeIngredients.map((ingredient) => ({
        ...ingredient,
        fullName: ingredientNames[ingredient.ingredientName] || "Unknown",
      }));
      setProcessedIngredients(processed);
    }
  }, [Recipe, ingredientNames]);

  if (recipeLoading || ingredientsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-transparent z-auto">
        <ChefHatSpinner />
      </div>
    );
  }

  if (recipeError || ingredientsError) {
    return (
      <div className="text-danger text-center mt-20 text-lg">
        Error:{" "}
        {recipeError?.message || ingredientsError || "Something went wrong."}
      </div>
    );
  }

  if (!Recipe || !Recipe.data) {
    return (
      <div className="text-gray-500 text-center mt-20 text-lg">
        Recipe not found.
      </div>
    );
  }

  const {
    recipeTitle,
    recipeImage,
    recipeVideoTutorial,
    recipeInstructions,
    categories,
  } = Recipe.data;

  const recipeSteps = recipeInstructions
    .split(".")
    .filter((step) => step.trim())
    .map((step, index) => ({
      title: `Step ${index + 1}`,
      description: step.trim() + ".",
    }));

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Card className="max-w-4xl mx-auto shadow-2xl relative flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 md:border-r border-gray-200">
          <Button
            isIconOnly
            color="primary"
            className="absolute top-4 left-4 z-30 bg-gradient-to-r from-olive to-olive hover:from-olive hover:to-olive shadow-md hover:shadow-xl rounded-full p-3 transition-all duration-300"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Button>
          <CardHeader className="relative">
            <img
              src={recipeImage}
              alt={recipeTitle}
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </CardHeader>
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-olive mb-4 flex items-center underline">
              <ChefHat className="mr-3 text-black" /> Ingredients:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              {processedIngredients.map((ingredient) => (
                <Popover
                  key={ingredient._id}
                  placement="bottom"
                  showArrow={true}
                  backdrop="blur"
                  isOpen={openPopoverId === ingredient._id} // Only open the popover for the selected ingredient
                  onOpenChange={(open) =>
                    setOpenPopoverId(open ? ingredient._id : null)
                  }
                >
                  <PopoverTrigger>
                    <Button
                      variant="light"
                      className="justify-start text-black gap-2 w-full"
                      onClick={() => setOpenPopoverId(ingredient._id)} // Open the popover for the clicked ingredient
                    >
                      <Plus className="w-4 h-4 text-olive cursor-pointer" />
                      <span className="font-medium mr-2">
                        {ingredient.quantity}
                      </span>
                      {ingredient.fullName}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">
                        Do you want to add {ingredient.fullName} to your grocery
                        list?
                      </div>
                      <div className="flex gap-4 mt-2">
                        <Button
                          variant="solid"
                          color="success"
                          onClick={() => handleAddToGroceryList(ingredient)} // Pass the ingredient to handleAddToGroceryList
                        >
                          Yes
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => setOpenPopoverId(null)} // Close the popover when No is clicked
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        </div>
        <CardBody className="w-full md:w-2/3 space-y-6 p-4 md:p-8">
          <section className="text-center mb-6">
            <h2 className="text-3xl font-bold text-olive flex justify-center items-center">
              <Leaf className="mr-3 text-olive" />
              {recipeTitle}
            </h2>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <BookOpen className="mr-3 text-olive" /> Instructions
            </h2>
            <Steps
              direction="vertical"
              current={-1}
              type="process"
              items={recipeSteps}
              className="pl-5"
              styles={{
                title: { color: "black" },
                description: { color: "black" },
              }}
              responsive
            />
          </section>
          {recipeVideoTutorial && (
            <section>
              <h2 className="text-2xl font-semibold text-olive mb-4 flex items-center">
                <Video className="mr-3 text-olive" /> Video Tutorial
              </h2>
              <Link
                href={recipeVideoTutorial}
                target="_blank"
                underline="hover"
                className="text-lg flex items-center text-olive"
              >
                Watch Tutorial
              </Link>
            </section>
          )}
          <section>
            <h2 className="text-2xl font-semibold text-olive mb-4">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <Chip key={index} color="success" variant="solid">
                  {category}
                </Chip>
              ))}
            </div>
          </section>
        </CardBody>
      </Card>
    </div>
  );
};

export default RecipeDetails;

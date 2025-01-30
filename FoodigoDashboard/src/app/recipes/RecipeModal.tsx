import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  X,
  Star,
  Clock,
  MapPin,
  Tag,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const RecipeModal = ({ isOpen, onClose, recipe }) => {
  const [currentTab, setCurrentTab] = React.useState("overview");
  const [currentStep, setCurrentStep] = React.useState(1);
  const steps = recipe?.recipeInstructions
    ?.split("\n")
    .filter((step) => step.trim());

  const averageRating = React.useMemo(() => {
    if (!recipe?.reviews?.length) return 0;
    const total = recipe.reviews.reduce(
      (acc, review) => acc + review.rating,
      0,
    );
    return (total / recipe.reviews.length).toFixed(1);
  }, [recipe?.reviews]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">
              {recipe?.recipeTitle}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="relative flex max-h-[80vh] overflow-hidden">
          {/* Left side - Image */}
          <div className="w-1/2">
            <div className="relative h-full min-h-[400px]">
              <Image
                src={recipe?.recipeImage || "/api/placeholder/400/400"}
                alt={recipe?.recipeTitle}
                className="object-cover"
                fill
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center space-x-4 text-white">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{averageRating}</span>
                    <span className="text-sm">
                      ({recipe?.reviews?.length} reviews)
                    </span>
                  </div>
                  {recipe?.area && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{recipe.area}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-1/2 border-l dark:border-gray-700">
            <Tabs defaultValue="overview" className="h-full">
              <TabsList className="w-full justify-start rounded-none border-b dark:border-gray-700">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(80vh-8rem)]">
                <div className="p-6">
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          Posted{" "}
                          {formatDistanceToNow(new Date(recipe?.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      {recipe?.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {recipe.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              <Tag className="mr-1 h-3 w-3" />
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Ingredients</h3>
                      <ul className="space-y-2">
                        {recipe?.recipeIngredients?.map((ingredient) => (
                          <li
                            key={ingredient._id}
                            className="flex items-center space-x-2"
                          >
                            <span className="text-sm font-medium">
                              {ingredient.quantity}
                            </span>
                            <span className="text-sm">
                              {ingredient.ingredientName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {recipe?.recipeVideoTutorial && (
                      <div className="rounded-lg border p-4 dark:border-gray-700">
                        <a
                          href={recipe.recipeVideoTutorial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 text-blue-500 hover:text-blue-600"
                        >
                          <Play className="h-5 w-5" />
                          <span>Watch Video Tutorial</span>
                        </a>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="instructions" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Step {currentStep} of {steps?.length}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setCurrentStep(Math.max(1, currentStep - 1))
                            }
                            disabled={currentStep === 1}
                            className="rounded p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentStep(
                                Math.min(steps?.length || 1, currentStep + 1),
                              )
                            }
                            disabled={currentStep === steps?.length}
                            className="rounded p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                        <p className="text-sm leading-relaxed">
                          {steps?.[currentStep - 1]}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-0">
                    <div className="space-y-4">
                      {recipe?.reviews?.map((review) => (
                        <div
                          key={review._id}
                          className="rounded-lg border p-4 dark:border-gray-700"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.user}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(review.date), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;

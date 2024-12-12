import React, { useState } from "react";
import { ChefHat, Plus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import toast from "react-hot-toast";

export const IngredientsSection = ({ ingredients }) => {
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const handleAddToGroceryList = (ingredient) => {
    toast.success(`${ingredient.fullName} added to your grocery list.`);
    setOpenPopoverId(null); // Close the popover
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">
        Ingredients
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {ingredients.map((ingredient) => (
          <Popover
            key={ingredient._id}
            placement="bottom"
            backdrop="blur"
            isOpen={openPopoverId === ingredient._id}
            onOpenChange={(isOpen) =>
              setOpenPopoverId(isOpen ? ingredient._id : null)
            }
          >
            <PopoverTrigger>
              <div className="flex items-center w-full border-b border-neutral-200 pb-2 cursor-pointer group">
                <Plus className="w-4 h-4 mr-3 text-neutral-400 group-hover:rotate-45 transition-transform" />
                <span className="flex-grow text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  {ingredient.fullName}
                </span>
                <span className="text-neutral-500 text-sm ml-2">
                  {ingredient.quantity}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4 w-64 space-y-3">
                <div>
                  <p className="font-medium text-neutral-800 mb-1">
                    {ingredient.fullName}
                  </p>
                  <p className="text-neutral-600 text-sm">
                    Quantity: {ingredient.quantity}
                  </p>
                </div>
                <Button
                  className="w-full bg-olive text-white"
                  variant="faded"
                  endContent={<ChefHat className="w-4 h-4" />}
                  onClick={() => handleAddToGroceryList(ingredient)}
                >
                  Add to Grocery List
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
};

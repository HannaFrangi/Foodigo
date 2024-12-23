import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Plus, CheckCircle } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useAddToGrocceryList } from "/src/hooks/useAddToGrocceryList";
import { useAuthStore } from "/src/store/useAuthStore";
import toast from "react-hot-toast";

export const IngredientsSection = ({ ingredients }) => {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [addedIngredients, setAddedIngredients] = useState(new Set());
  const { addToGrocceryList, loading } = useAddToGrocceryList();

  const { authUser } = useAuthStore();

  const handleAddToGroceryList = async (ingredient) => {
    if (authUser == null) {
      toast.error("You must be Logged in!");
      setOpenPopoverId(null);
      return;
    }
    console.log(ingredient);
    setAddedIngredients((prev) => new Set(prev.add(ingredient._id)));
    await addToGrocceryList(ingredient);
    setOpenPopoverId(null);
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  // Individual ingredient item animation
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  // Popover animation
  const popoverVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h2
        className="text-2xl font-bold text-olive mb-6 flex items-center underline"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChefHat className="w-6 h-6 mr-3 text-olive" />
        Ingredients:
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {ingredients.map((ingredient) => (
            <motion.div
              key={ingredient._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              exit="hidden"
              className="relative"
            >
              <Popover
                placement="bottom"
                backdrop="blur"
                isOpen={openPopoverId === ingredient._id}
                onOpenChange={(isOpen) =>
                  setOpenPopoverId(isOpen ? ingredient._id : null)
                }
              >
                <PopoverTrigger>
                  <motion.div
                    className="flex items-center w-full border-b border-neutral-200 pb-2 cursor-pointer group relative"
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Added/Not Added Indicator */}
                    {addedIngredients.has(ingredient._id) ? (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle className="w-4 h-4 mr-3 text-green-500 animate-pulse" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 45 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Plus className="w-4 h-4 mr-3 text-neutral-400" />
                      </motion.div>
                    )}

                    <span className="flex-grow text-neutral-700 group-hover:text-neutral-900 transition-colors">
                      {ingredient.fullName}
                    </span>
                    <span className="text-neutral-500 text-sm ml-2">
                      {ingredient.quantity}
                    </span>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="p-0 overflow-hidden">
                  <motion.div
                    variants={popoverVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-4 w-64 space-y-3 bg-white shadow-lg rounded-xl"
                  >
                    <div className="mb-3">
                      <motion.p
                        className="font-semibold text-olive text-lg mb-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {ingredient.fullName}
                      </motion.p>
                      <motion.p
                        className="text-neutral-600 text-sm flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="mr-2">Quantity:</span>
                        <span className="font-medium text-olive">
                          {ingredient.quantity}
                        </span>
                      </motion.p>
                    </div>
                    <Button
                      color="primary"
                      variant="solid"
                      className="w-full bg-olive text-white"
                      endContent={<ChefHat className="w-4 h-4" />}
                      onClick={() => handleAddToGroceryList(ingredient)}
                      isDisabled={addedIngredients.has(ingredient._id)}
                      loading={loading}
                    >
                      {addedIngredients.has(ingredient._id)
                        ? "Added to List"
                        : "Add to Grocery List"}
                    </Button>
                  </motion.div>
                </PopoverContent>
              </Popover>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

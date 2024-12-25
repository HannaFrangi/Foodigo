import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { CheckIcon, DeleteIcon, ChevronUpIcon } from "@nextui-org/shared-icons";
import useDeleteGroceryItem from "/src/hooks/useDeleteGrocceryListItem";
import useTogglePurchasedItem from "/src/hooks/useTogglePurchasedItem";
import useGetGrocceryList from "/src/hooks/useGetGrocceryList";
import { ShoppingCartIcon } from "lucide-react";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";

const GroceryList = () => {
  const { loading, error, grocceryList, getGrocceryList } =
    useGetGrocceryList();
  const { togglePurchasedItem } = useTogglePurchasedItem();
  const {
    isLoading: deleteLoading,
    error: deleteError,
    DeleteGroceryItem,
  } = useDeleteGroceryItem();
  const [currentList, setCurrentList] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    getGrocceryList();
  }, []);

  useEffect(() => {
    setCurrentList(grocceryList || []);
  }, [grocceryList]);

  const handleTogglePurchase = async (groceryItemId) => {
    await togglePurchasedItem(groceryItemId);
    getGrocceryList();
  };

  const handleDeleteGroceryItem = async (id) => {
    await DeleteGroceryItem(id);
    getGrocceryList();
  };

  const purchasedCount =
    currentList?.filter((item) => item.isPurchased).length || 0;
  const totalCount = currentList?.length || 0;
  const progressPercentage = totalCount
    ? Math.round((purchasedCount / totalCount) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <ChefHatSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCartIcon className="w-8 h-8 text-black" />
              <Chip
                size="sm"
                variant="solid"
                className="absolute -top-2 -right-2"
              >
                {totalCount}
              </Chip>
            </div>
            <h1 className="text-2xl font-bold text-olive">Grocery List</h1>
          </div>
          <div className="flex items-center gap-4">
            <Progress
              className="w-32"
              aria-label="Progress"
              classNames={{
                indicator: "bg-gradient-to-r from-red-400 to-olive",
              }}
              size="sm"
              value={progressPercentage}
            />

            <span className="text-sm">
              {purchasedCount}/{totalCount}
            </span>
          </div>
        </CardHeader>

        <CardBody className="gap-4">
          {(error || deleteError) && (
            <div className="bg-danger-50 text-danger p-4 rounded-lg mb-4">
              {error || deleteError}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {currentList.map((item) => (
              <div
                key={item._id}
                className={`group relative rounded-lg border p-4 transition-all ${
                  hoveredItem === item._id ? "bg-default-100" : ""
                } ${item.isPurchased ? "opacity-80" : ""}`}
                onMouseEnter={() => setHoveredItem(item._id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-medium ${
                          item.isPurchased
                            ? "line-through text-default-400"
                            : ""
                        }`}
                      >
                        {item.ingredientID?.name}
                      </h3>
                      <Chip
                        size="sm"
                        color={item.isPurchased ? "success" : "primary"}
                        variant="flat"
                      >
                        {item.isPurchased ? "Purchased" : "To Buy"}
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-900">
                      Quantity: {item.quantity || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      Last Updated:{" "}
                      {new Date(item.lastUpdated).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip
                      content={
                        item.isPurchased
                          ? "Mark as unpurchased"
                          : "Mark as purchased"
                      }
                    >
                      <Button
                        isIconOnly
                        // color={item.isPurchased ? "success" : "primary"}

                        className={
                          item.isPurchased
                            ? "bg-olive text-white"
                            : "bg-transparent"
                        }
                        size="sm"
                        onClick={() => handleTogglePurchase(item._id)}
                        isDisabled={deleteLoading}
                      >
                        <CheckIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete item">
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        size="sm"
                        onClick={() => handleDeleteGroceryItem(item._id)}
                        isDisabled={deleteLoading}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}

            {currentList.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCartIcon className="w-12 h-12 mx-auto text-default-400 mb-4" />
                <p className="text-default-500">Your grocery list is empty</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default GroceryList;

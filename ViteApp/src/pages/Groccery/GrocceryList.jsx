import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Tooltip,
  Divider,
  Badge,
  ScrollShadow,
} from "@nextui-org/react";
import { CheckIcon, DeleteIcon } from "@nextui-org/shared-icons";
import { ChevronDown, ShoppingCart, PackageCheck } from "lucide-react";
import useDeleteGroceryItem from "/src/hooks/useDeleteGrocceryListItem";
import useTogglePurchasedItem from "/src/hooks/useTogglePurchasedItem";
import useGetGrocceryList from "/src/hooks/useGetGrocceryList";
import ChefHatSpinner from "/src/utils/ChefHatSpinner";

const GroceryList = () => {
  window.scrollTo(0, 0);

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
  const [showPurchased, setShowPurchased] = useState(false);

  useEffect(() => {
    getGrocceryList();
  }, []);

  useEffect(() => {
    setCurrentList(grocceryList || []);
  }, [grocceryList]);

  const handleTogglePurchase = async (groceryItemId) => {
    const updatedList = currentList.map((item) =>
      item._id === groceryItemId
        ? { ...item, isPurchased: !item.isPurchased }
        : item
    );
    setCurrentList(updatedList);
    await togglePurchasedItem(groceryItemId);
  };

  const handleDeleteGroceryItem = async (id) => {
    const updatedList = currentList.filter((item) => item._id !== id);
    setCurrentList(updatedList);
    await DeleteGroceryItem(id);
  };

  const purchasedItems = currentList.filter((item) => item.isPurchased);
  const unpurchasedItems = currentList.filter((item) => !item.isPurchased);
  const purchasedCount = purchasedItems.length;
  const totalCount = currentList.length;
  const progressPercentage = totalCount
    ? Math.round((purchasedCount / totalCount) * 100)
    : 0;

  document.title = "Foodigo | Grocery List";
  const GroceryItem = ({ item }) => (
    <div
      className={`relative px-4 py-3 transition-all duration-200 ease-in-out ${
        hoveredItem === item._id ? "bg-default-100" : "bg-transparent"
      } ${item.isPurchased ? "opacity-90" : ""}`}
      onMouseEnter={() => setHoveredItem(item._id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-medium truncate ${
                item.isPurchased ? "text-default-400 line-through" : ""
              }`}
            >
              {item.ingredientID?.name}
            </h3>
            <Chip
              size="sm"
              variant="flat"
              className={`${
                item.isPurchased
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}
            >
              {item.quantity || "N/A"}
            </Chip>
          </div>
          <p className="text-xs text-default-400">
            Updated {new Date(item.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip
            content={
              item.isPurchased ? "Mark as unpurchased" : "Mark as purchased"
            }
          >
            <Button
              isIconOnly
              size="sm"
              className={`transition-all duration-200 ${
                item.isPurchased
                  ? "bg-default-100 hover:bg-olive text-black"
                  : "bg-olive text-white hover:bg-lowolive"
              }`}
              onClick={() => handleTogglePurchase(item._id)}
              isDisabled={deleteLoading}
            >
              <CheckIcon className="text-sm" />
            </Button>
          </Tooltip>
          <Tooltip content="Remove item">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-danger hover:text-danger-400"
              onClick={() => handleDeleteGroceryItem(item._id)}
              isDisabled={deleteLoading}
            >
              <DeleteIcon className="text-sm" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ChefHatSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen p-4 bg-transparent">
      <Card className="h-full shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Badge
              content={totalCount}
              color="primary"
              shape="circle"
              size="lg"
            >
              <ShoppingCart className="w-8 h-8 text-primary" />
            </Badge>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Grocery List
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Progress
              aria-label="Progress"
              size="sm"
              value={progressPercentage}
              className="w-32"
              classNames={{
                indicator: "bg-gradient-to-r from-primary to-success",
              }}
            />
            <Chip variant="flat" className="bg-primary/10 text-primary">
              {purchasedCount}/{totalCount}
            </Chip>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="gap-4 px-0 h-full">
          {(error || deleteError) && (
            <div className="mx-4 p-3 rounded-lg bg-danger-50 text-danger text-sm">
              {error || deleteError}
            </div>
          )}

          <ScrollShadow className="h-[calc(100vh-200px)]">
            {/* Unpurchased Items */}
            <div className="divide-y">
              {unpurchasedItems.map((item) => (
                <GroceryItem key={item._id} item={item} />
              ))}
            </div>

            {/* Purchased Items Section */}
            {purchasedItems.length > 0 && (
              <div className="mt-4">
                <Button
                  className="w-full flex justify-between items-center py-3 px-4 bg-default-50 hover:bg-default-100"
                  onClick={() => setShowPurchased(!showPurchased)}
                  endContent={
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        showPurchased ? "rotate-180" : ""
                      }`}
                    />
                  }
                >
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-darkolive" />
                    <span className="font-medium">
                      Purchased Items ({purchasedItems.length})
                    </span>
                  </div>
                </Button>

                <div
                  className={`transition-all duration-200 ${
                    showPurchased
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="divide-y bg-default-50">
                    {purchasedItems.map((item) => (
                      <GroceryItem key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentList.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-default-300 mb-4" />
                <p className="text-default-400">Your grocery list is empty</p>
              </div>
            )}
          </ScrollShadow>
        </CardBody>
      </Card>
    </div>
  );
};

export default GroceryList;

import React, { useState } from "react";
import { Input, Button, notification } from "antd";
import useGetGrocceryList from "../../hooks/useGetGrocceryList"; // Import the hook
import { Spinner } from "@nextui-org/react";

const AddToGroceryList = () => {
  const [ingredientID, setIngredientID] = useState("");
  const [quantity, setQuantity] = useState("");
  const { loading, error, grocceryList, getGrocceryList } =
    useGetGrocceryList(); // Use the hook

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Grocery List</h2>

      {error && (
        <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="space-y-4">
          {grocceryList.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  Ingredient: {item.ingredientID.name}
                </p>{" "}
                {/* Accessing ingredient name */}
                <p>Quantity: {item.quantity || "N/A"}</p>
              </div>
              <div>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    item.isPurchased
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {item.isPurchased ? "Purchased" : "Not Purchased"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToGroceryList;

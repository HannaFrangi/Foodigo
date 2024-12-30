import React, { useEffect, useMemo, useState } from "react";
import { Select, Button, Tooltip, Input, Typography, Alert } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import useGetAllIngredients from "/src/hooks/useGetAllIngredients";
import { Spinner } from "@nextui-org/react";
const { Text } = Typography;

const MEASUREMENT_UNITS = {
  common: [
    { value: "g", label: "Grams (g)" },
    { value: "ml", label: "Milliliters (ml)" },
    { value: "cup", label: "Cups" },
    { value: "tbsp", label: "Tablespoons" },
    { value: "tsp", label: "Teaspoons" },
    { value: "pcs", label: "Pieces" },
    { value: "bunch", label: "Bunch" },
    { value: "clove", label: "Clove" },
    { value: "slice", label: "Slice" },
  ],
  other: [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "l", label: "Liters (l)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "lb", label: "Pounds (lb)" },
    { value: "pinch", label: "Pinch" },
    { value: "whole", label: "Whole" },
    { value: "dash", label: "Dash" },
    { value: "drop", label: "Drop" },
    { value: "stick", label: "Stick" },
    { value: "can", label: "Can" },
    { value: "package", label: "Package" },
    { value: "handful", label: "Handful" },
  ],
};

const EditIngredient = ({ formData, setFormData, errors }) => {
  const { loading, ingredientNames, fetchAllIngrediants } =
    useGetAllIngredients();
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const unitOptions = useMemo(
    () => [
      { label: "Common Units", options: MEASUREMENT_UNITS.common },
      { label: "Other Units", options: MEASUREMENT_UNITS.other },
    ],
    []
  );

  const validateQuantity = (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  const handleAddIngredient = () => {
    const newIndex = formData.recipeIngredients.length;
    setFormData((prev) => ({
      ...prev,
      recipeIngredients: [
        ...prev.recipeIngredients,
        { ingredientName: "", quantity: "", unit: "" },
      ],
    }));
    setRecentlyAdded(newIndex);
    setTimeout(() => setRecentlyAdded(null), 1500);
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (value, index, field) => {
    if (field === "quantity") {
      // Extract just the number from the combined quantity string if it exists
      const quantityMatch = value.match(/[\d.]+/);
      value = quantityMatch ? quantityMatch[0] : value;
    }

    setFormData((prev) => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients.map((ing, i) => {
        if (i !== index) return ing;

        const updatedIng = { ...ing, [field]: value };

        // If the field being changed is either quantity or unit,
        // update the combined quantity field
        if (field === "quantity" || field === "unit") {
          const numericQuantity = updatedIng.quantity || "";
          const unit = updatedIng.unit || "";
          updatedIng.displayQuantity = `${numericQuantity}${
            unit ? ` ${unit}` : ""
          }`;
        }

        return updatedIng;
      }),
    }));
  };

  const parseInitialIngredient = (ingredient) => {
    if (ingredient.quantity && typeof ingredient.quantity === "string") {
      const parts = ingredient.quantity.split(" ");
      if (parts.length > 1) {
        return {
          ...ingredient,
          quantity: parts[0],
          unit: parts[1],
          displayQuantity: ingredient.quantity,
        };
      }
    }
    return ingredient;
  };

  useEffect(() => {
    fetchAllIngrediants();

    // Parse any existing ingredients when component mounts
    if (formData.recipeIngredients) {
      setFormData((prev) => ({
        ...prev,
        recipeIngredients: prev.recipeIngredients.map(parseInitialIngredient),
      }));
    }
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Recipe Ingredients
          </h2>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddIngredient}
          className="bg-olive hover:bg-lowolive border-none shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add Ingredient
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {formData.recipeIngredients?.map((ingredient, index) => (
            <div
              key={index}
              className={`p-4 transition-all duration-300 ease-in-out flex flex-wrap sm:flex-nowrap gap-4
                ${hoveredIndex === index ? "bg-gray-50" : "bg-white"}
                ${recentlyAdded === index ? "animate-fade-in" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-shrink-0">
                  <CheckCircleFilled className="text-green-500" />
                </div>
              </div>

              <div className="flex-grow w-full sm:w-auto">
                <Select
                  showSearch
                  className="w-full"
                  placeholder={
                    <div className="flex items-center gap-2">
                      <SearchOutlined />
                      <span>Search ingredients...</span>
                    </div>
                  }
                  value={ingredient.ingredientName}
                  onChange={(value) =>
                    handleIngredientChange(value, index, "ingredientName")
                  }
                  status={
                    errors?.recipeIngredients?.[index]?.ingredientName
                      ? "error"
                      : ""
                  }
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  options={ingredientNames.map((ing) => ({
                    value: ing.id,
                    label: ing.name,
                  }))}
                  popupClassName="rounded-lg shadow-lg"
                />
              </div>

              <Input
                type="text"
                placeholder="Amount"
                className="w-full sm:w-24"
                value={ingredient.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  handleIngredientChange(value, index, "quantity");
                }}
                status={!validateQuantity(ingredient.quantity) ? "error" : ""}
                suffix={
                  <Tooltip title="Enter a positive number">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                }
              />

              <Select
                className="w-full sm:w-36"
                showSearch
                value={ingredient.unit}
                onChange={(value) =>
                  handleIngredientChange(value, index, "unit")
                }
                options={unitOptions}
                status={errors?.recipeIngredients?.[index]?.unit ? "error" : ""}
                popupClassName="rounded-lg shadow-lg"
                placement="bottomLeft"
              />

              <Tooltip title="Remove Ingredient">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveIngredient(index)}
                  className={`transition-opacity duration-200
                    ${hoveredIndex === index ? "opacity-100" : "opacity-0"}`}
                />
              </Tooltip>

              {errors?.recipeIngredients?.[index] && (
                <Text type="danger" className="block mt-2 text-sm">
                  {Object.values(errors.recipeIngredients[index])[0]}
                </Text>
              )}
            </div>
          ))}

          {(!formData.recipeIngredients ||
            formData.recipeIngredients.length === 0) && (
            <div className="p-12 text-center">
              <div className="mb-4">
                <SearchOutlined className="text-4xl text-gray-300" />
              </div>
              <Text className="block mb-4 text-gray-500">
                Start building your recipe by adding ingredients
              </Text>
              <Button
                type="default"
                onClick={handleAddIngredient}
                icon={<PlusOutlined />}
                className="shadow-sm hover:shadow-md transition-all duration-200"
              >
                Add your first ingredient
              </Button>
            </div>
          )}
        </div>
      </div>

      {errors?.recipeIngredients &&
        typeof errors.recipeIngredients === "string" && (
          <Alert
            message={errors.recipeIngredients}
            type="error"
            showIcon
            className="rounded-lg"
          />
        )}
    </div>
  );
};

export default EditIngredient;

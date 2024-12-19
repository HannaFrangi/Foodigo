import React, { useEffect } from "react";
import { Select, Button, Tooltip, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import useGetAllIngredients from "/src/hooks/useGetAllIngredients";

const RecipeIngredient = ({ formData, setFormData, errors }) => {
  const { loading, ingredientNames, error, fetchAllIngrediants } =
    useGetAllIngredients();

  useEffect(() => {
    fetchAllIngrediants();
  }, []);

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (values, index) => {
    setFormData((prev) => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients.map((ingredient, i) =>
        i === index ? { ...ingredient, ingredientNames: values } : ingredient
      ),
    }));
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-olive">Ingredients</h2>
      </div>

      {/* Ingredient List */}
      {formData.recipeIngredients.map((ingredient, index) => (
        <div key={index} className="flex space-x-2 items-center mb-4">
          <Select
            mode="multiple"
            showSearch
            className="w-full"
            placeholder="Select ingredients"
            value={ingredient.ingredientNames}
            onChange={(values) => handleIngredientChange(values, index)}
            loading={loading}
            status={
              errors?.recipeIngredients?.[index]?.ingredientNames ? "error" : ""
            }
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            options={ingredientNames.map((ingredient) => ({
              value: ingredient.name,
              label: ingredient.name,
            }))}
            style={{ width: "100%" }}
            maxTagCount={3}
            maxTagTextLength={20}
            allowClear
          />

          {formData.recipeIngredients.length > 1 && (
            <Tooltip title="Remove Ingredient Group">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveIngredient(index)}
                size="small"
              />
            </Tooltip>
          )}
        </div>
      ))}

      {errors?.recipeIngredients?.[0]?.ingredientNames && (
        <div className="text-red-500 text-sm">
          {errors.recipeIngredients[0].ingredientNames}
        </div>
      )}
    </div>
  );
};

export default RecipeIngredient;

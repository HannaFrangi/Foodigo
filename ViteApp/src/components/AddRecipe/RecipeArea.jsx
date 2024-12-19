import React, { useEffect } from "react";
import { Spin } from "antd";
import useGetAllAreas from "/src/hooks/useGetAllAreas";
import { Select, SelectItem } from "@nextui-org/react";

const RecipeArea = ({ formData, setFormData, errors }) => {
  const { area, fetchALlAreas, loading, error } = useGetAllAreas();
  useEffect(() => {
    fetchALlAreas();
  }, []);

  const handleAreaChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      recipeArea: value,
    }));
  };

  if (loading) {
    return <Spin size="small" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Failed to load areas</div>;
  }

  return (
    <div className="space-y-2">
      <Select
        placeholder="Select a cuisine area"
        showSearch
        onChange={handleAreaChange}
        isInvalid={!!errors?.recipeArea}
        className="w-full"
        aria-label="Recipe Area"
      >
        {area.map((Area) => (
          <SelectItem key={Area._id}>{Area.name}</SelectItem>
        ))}
      </Select>
      {errors?.recipeArea && (
        <p className="text-sm text-red-500 mt-1">{errors.recipeArea}</p>
      )}
    </div>
  );
};

export default RecipeArea;

import { Select } from "antd";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const RecipeCat = ({ formData, setFormData, errors }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    try {
      const categoriesData = JSON.parse(
        localStorage.getItem("categories") ||
          "[" +
            document
              .querySelector('meta[name="categories"]')
              .getAttribute("content") +
            "]"
      );
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error parsing categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  const handleChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      categories: selected,
    }));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-olive">Select Categories</p>
      <Select
        placeholder="Select categories"
        value={formData.categories}
        onChange={handleChange}
        status={errors?.categories ? "error" : ""}
        className="w-full"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.label?.toLowerCase().includes(input.toLowerCase())
        }
        options={categories.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }))}
        maxTagCount={3}
        showSearch
        allowClear
        style={{ width: "100%" }}
        notFoundContent="No categories found"
      />
      {errors?.categories && (
        <p className="text-sm text-red-500 mt-1">{errors.categories}</p>
      )}
    </div>
  );
};

export default RecipeCat;

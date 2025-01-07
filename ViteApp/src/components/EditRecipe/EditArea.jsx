import { useEffect } from "react";
import { Select } from "antd";
import useGetAllAreas from "/src/hooks/useGetAllAreas";
import { Spinner } from "@nextui-org/react";

const EditArea = ({ formData, setFormData, errors }) => {
  const { area, loading, error, fetchALlAreas } = useGetAllAreas();

  useEffect(() => {
    fetchALlAreas();
  }, []);

  const handleAreaChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      area: value,
    }));
  };

  if (loading) {
    return <Spinner size={32} color="#ffffff" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Failed to load areas</div>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-olive">Recipe Area</p>
      <Select
        showSearch
        placeholder="Select a cuisine area"
        optionFilterProp="children"
        onChange={handleAreaChange}
        value={formData.area}
        status={errors?.recipeArea ? "error" : ""}
        loading={loading}
        className="w-full"
        filterOption={(input, option) =>
          option?.label?.toLowerCase().includes(input.toLowerCase())
        }
        options={area?.map((item) => ({
          value: item._id,
          label: item.name,
        }))}
      />
      {errors?.recipeArea && (
        <p className="text-sm text-red-500 mt-1">{errors.recipeArea}</p>
      )}
    </div>
  );
};

export default EditArea;

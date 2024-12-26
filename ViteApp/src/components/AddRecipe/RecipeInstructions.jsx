import React, { useState } from "react";
import { Input, Button, Typography, Tooltip } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const RecipeInstructions = ({ formData, setFormData, errors }) => {
  const [steps, setSteps] = useState(
    formData.recipeInstructions
      ? formData.recipeInstructions
          .split(".")
          .filter((step) => step.trim())
          .map((step) => step + ".")
      : [""]
  );
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const updateFormData = (newSteps) => {
    setFormData((prev) => ({
      ...prev,
      recipeInstructions: newSteps.join(""),
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    let formattedValue = value;
    if (!value.endsWith(".") && value.trim() !== "") {
      formattedValue = value + ".";
    }
    newSteps[index] = formattedValue;
    setSteps(newSteps);
    updateFormData(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
    updateFormData([...steps, ""]);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
      updateFormData(newSteps);
    }
  };

  const moveStep = (index, direction) => {
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + direction];
    newSteps[index + direction] = temp;
    setSteps(newSteps);
    updateFormData(newSteps);
  };

  const isStepComplete = (step) => {
    return step.trim().length > 0;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Recipe Instructions
          </h2>
          <Text className="text-gray-500">
            {steps.filter(isStepComplete).length} of {steps.length} steps
            completed
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addStep}
          className="bg-olive hover:bg-lowolive border-none shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add Step
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-4 transition-all duration-300 ease-in-out flex items-center gap-4
                ${hoveredIndex === index ? "bg-gray-50" : "bg-white"}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isStepComplete(step) ? (
                    <CheckCircleFilled className="text-green-500" />
                  ) : (
                    <ClockCircleOutlined className="text-gray-400" />
                  )}
                </div>
                <div className="w-16 text-sm font-medium">Step {index + 1}</div>
              </div>

              <Input
                value={step.endsWith(".") ? step.slice(0, -1) : step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder="Describe this step..."
                className="flex-1"
                status={
                  !!errors?.recipeInstructions && !step.trim() ? "error" : ""
                }
              />

              <div
                className={`flex gap-2 transition-opacity duration-200 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                {index > 0 && (
                  <Tooltip title="Move Up">
                    <Button
                      type="text"
                      icon={<ArrowUpOutlined />}
                      onClick={() => moveStep(index, -1)}
                    />
                  </Tooltip>
                )}
                {index < steps.length - 1 && (
                  <Tooltip title="Move Down">
                    <Button
                      type="text"
                      icon={<ArrowDownOutlined />}
                      onClick={() => moveStep(index, 1)}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Remove Step">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeStep(index)}
                    disabled={steps.length === 1}
                  />
                </Tooltip>
              </div>
            </div>
          ))}

          {steps.length === 0 && (
            <div className="p-12 text-center">
              <Text className="block mb-4 text-gray-500">
                Start adding steps to your recipe
              </Text>
              <Button
                type="default"
                onClick={addStep}
                icon={<PlusOutlined />}
                className="shadow-sm hover:shadow-md transition-all duration-200"
              >
                Add your first step
              </Button>
            </div>
          )}
        </div>
      </div>

      {errors?.recipeInstructions && (
        <Text type="danger" className="block mt-2">
          {errors.recipeInstructions}
        </Text>
      )}
    </div>
  );
};

export default RecipeInstructions;

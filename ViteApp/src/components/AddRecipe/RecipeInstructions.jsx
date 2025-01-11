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
              className={`p-3 sm:p-4 transition-all duration-300 ease-in-out
          ${hoveredIndex === index ? "bg-gray-50" : "bg-white"}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Step Number and Status */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    {isStepComplete(step) ? (
                      <CheckCircleFilled className="text-green-500 text-lg" />
                    ) : (
                      <ClockCircleOutlined className="text-gray-400 text-lg" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Step {index + 1}
                  </div>
                </div>

                {/* TextArea Field */}
                <div className="flex-1 min-w-0">
                  <Input.TextArea
                    value={step.endsWith(".") ? step.slice(0, -1) : step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder="Describe this step..."
                    className="w-full text-sm sm:text-base"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    status={
                      !!errors?.recipeInstructions && !step.trim()
                        ? "error"
                        : ""
                    }
                  />
                </div>

                {/* Action Buttons */}
                <div
                  className={`flex items-center justify-end gap-1 sm:gap-2 transition-opacity duration-200 
              ${
                hoveredIndex === index
                  ? "opacity-100"
                  : "opacity-0 sm:opacity-0"
              }`}
                >
                  {index > 0 && (
                    <Tooltip title="Move Up">
                      <Button
                        type="text"
                        icon={<ArrowUpOutlined />}
                        onClick={() => moveStep(index, -1)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      />
                    </Tooltip>
                  )}
                  {index < steps.length - 1 && (
                    <Tooltip title="Move Down">
                      <Button
                        type="text"
                        icon={<ArrowDownOutlined />}
                        onClick={() => moveStep(index, 1)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                      className="hover:bg-red-50"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}

          {steps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
              <Text className="text-gray-500 mb-4 text-center">
                Start adding steps to your recipe
              </Text>
              <Button
                type="default"
                onClick={addStep}
                icon={<PlusOutlined />}
                className="shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50"
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

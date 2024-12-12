import React from "react";
import { Steps } from "antd";

export const InstructionsSection = ({ instructions }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-olive-800 mb-4">
        Instructions
      </h2>
      <Steps
        direction="vertical"
        items={instructions}
        className="text-olive-900"
      />
    </div>
  );
};

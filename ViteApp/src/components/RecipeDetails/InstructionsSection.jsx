import React from "react";
import { motion } from "framer-motion";
import { Steps } from "antd";

export const InstructionsSection = ({ instructions }) => {
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  // Individual step animation
  const stepVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  // Customized step items with motion wrapper
  const animatedInstructions = instructions.map((instruction, index) => ({
    ...instruction,
    style: {
      "--ant-primary-color": "#14532D", // Olive for active step
      "--ant-primary-1": "#14532D", // Olive for borders
    },
    className: "custom-step-item",
    title: (
      <motion.span
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        className="text-olive-900 font-medium"
      >
        {instruction.title}
      </motion.span>
    ),
    description: (
      <motion.span
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        className="text-olive-700"
      >
        {instruction.description}
      </motion.span>
    ),
  }));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold text-olive-800 mb-4"
      >
        Instructions
      </motion.h2>

      <Steps
        direction="vertical"
        items={animatedInstructions}
        className="custom-steps"
      />

      {/* Inline styles to ensure icon styling */}
      <style jsx>{`
        .custom-steps .ant-steps-item-icon {
          background-color: #5d6544 !important;
          border-color: #14532d !important;
        }
        .custom-steps .ant-steps-item-icon .ant-steps-icon {
          color: white !important;
        }
        .custom-steps .ant-steps-item-title {
          color: #5d6544 !important;
          text-decoration: underline !important;
        }
        .custom-steps .ant-steps-item-description {
          color: #000000 !important;
        }
      `}</style>
    </motion.div>
  );
};

import React from "react";

const Skeleton = () => {
  return (
    <div
      className="w-full sm:max-w-xs lg:max-w-[22rem] shadow-sm mx-auto sm:mx-0 
      bg-white rounded-2xl sm:rounded-3xl overflow-hidden 
      animate-pulse transition-all duration-500 ease-out cursor-pointer relative"
    >
      {/* Shine effect overlay (hidden in skeleton) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 duration-700 hidden sm:block"></div>

      {/* Image container (skeleton) */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20 z-10" />
        <div className="w-full h-40 sm:h-48 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Content section (skeleton) */}
      <div className="px-4 pt-4 pb-5 sm:pb-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <div className="w-24 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-24 h-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;

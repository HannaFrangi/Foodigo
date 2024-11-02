import React from "react";

function searchHero() {
  return (
    <div>
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Discover Your Next Favorite Recipe
        </h1>
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for recipes..."
            className="w-full px-4 py-3 pl-12 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5d6544]"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export default searchHero;

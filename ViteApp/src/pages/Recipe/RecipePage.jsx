import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown, GridIcon, List } from "lucide-react";
import { RecipeCard } from "../../components/RecipeCard/RecipeCard";

const CATEGORIES = {
  mealType: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
  dietary: [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
  ],
  cuisine: [
    "Italian",
    "Mexican",
    "Asian",
    "Mediterranean",
    "American",
    "Indian",
  ],
  difficulty: ["Easy", "Medium", "Hard"],
  cookTime: ["< 30 mins", "30-60 mins", "> 60 mins"],
};

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[180px] px-4 py-2 text-left bg-white border rounded-lg flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-olive"
      >
        <span>{value || "Sort by"}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Filter className="h-5 w-5" />
          {title}
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="px-6 py-4 border-t">{children}</div>}
    </div>
  );
};

const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
      active
        ? "bg-olive text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

export default function RecipePage() {
  const preparation = useRef();

  gsap.registerPlugin(ScrollToPlugin);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#FFFAF5] to-white p-4 md:p-8"
      ref={preparation}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Discover <span className="text-olive">Recipes</span>
          </h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-olive"
              />
            </div>
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "popular", label: "Most Popular" },
                { value: "recent", label: "Recently Added" },
                { value: "rating", label: "Highest Rated" },
              ]}
            />
          </div>
        </div>

        <CustomAccordion title="Filters">
          <div className="space-y-6">
            {Object.entries(CATEGORIES).map(([category, values]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 capitalize">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <FilterChip
                      key={value}
                      label={value}
                      active={filters[category].includes(value)}
                      onClick={() => handleFilterToggle(category, value)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {Object.values(filters).some((arr) => arr.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-olive"
              >
                <X className="h-4 w-4" /> Clear all filters
              </button>
            )}
          </div>
        </CustomAccordion>

        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {loading
                ? "Loading..."
                : `${filteredRecipes.length} recipes found`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg ${
                  view === "grid" ? "bg-olive text-white" : ""
                }`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg ${
                  view === "list" ? "bg-olive text-white" : ""
                }`}
              >
                <List />
              </button>
            </div>
          </div>
          <div
            className={`${
              view === "grid" ? "grid grid-cols-2 gap-6" : "space-y-4"
            }`}
          >
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {!loading && filteredRecipes.length === 0 && (
            <p>No recipes found. Adjust filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

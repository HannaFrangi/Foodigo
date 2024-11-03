import React from "react";
import SearchRecipe from "../components/SearchRecipe/SearchRecipe";
import { Hero } from "./Home/Hero";
import LatestRecipe from "../components/LatestRecipe/LatestRecipe";

const Homepage = () => {
  return (
    <>
      <LatestRecipe />
      <SearchRecipe />
      <Hero /> {/* Main COmponent */}
    </>
  );
};

export default Homepage;

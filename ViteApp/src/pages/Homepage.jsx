import React from "react";
import SearchRecipe from "../components/SearchRecipe/SearchRecipe";
import { Hero } from "./Home/Hero";

const Homepage = () => {
  return (
    <>
      <Hero />
      <SearchRecipe />
    </>
  );
};

export default Homepage;

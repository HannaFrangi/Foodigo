import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SearchRecipe from "../components/SearchRecipe/SearchRecipe";
import { Hero } from "./Home/Hero";
import LatestRecipe from "../components/LatestRecipe/LatestRecipe";

const Homepage = () => {
  const latestRef = useRef(null);
  const searchRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });

    tl.from(latestRef.current, { opacity: 0, y: 100 })
      .from(searchRef.current, { opacity: 0, y: 100 }, "-=0.8")
      .from(heroRef.current, { opacity: 0, y: 100 }, "-=0.8");
  }, []);

  return (
    <>
      <div ref={latestRef}>
        <LatestRecipe />
      </div>
      <div ref={searchRef}>
        <SearchRecipe />
      </div>
      <div ref={heroRef}>
        <Hero />
      </div>
    </>
  );
};

export default Homepage;

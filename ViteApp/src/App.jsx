import React from "react";
import Navbar from "./components/Navbar";
import ReactLenis from "@studio-freight/react-lenis";

function App() {
  return (
    <>
      <ReactLenis root>
        <Navbar />
      </ReactLenis>
    </>
  );
}

export default App;

import React from "react";
import Navbar from "./components/Navbar";
import ReactLenis from "@studio-freight/react-lenis";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import RecipePage from "./pages/RecipePage";
import PageLayout from "./layout/PageLayout";

function App() {
  return (
    <>
      <ReactLenis root>
        {/* <Navbar /> */}
        <PageLayout>
          <Routes>
            {/* <Route path="/" element={<Navbar />} /> */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/recipe" element={<RecipePage />} />
          </Routes>
        </PageLayout>
      </ReactLenis>
    </>
  );
}

export default App;

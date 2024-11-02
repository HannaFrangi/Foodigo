import React from "react";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";
import { Route, Routes } from "react-router-dom";

import AuthPage from "./pages/Auth/AuthPage";
import RecipePage from "./pages/Recipe/RecipePage";
import PageLayout from "./layout/PageLayout";
import Homepage from "./pages/Homepage";

function App() {
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  return (
    <>
      <ReactLenis root>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/recipe" element={<RecipePage />} />
          </Routes>
        </PageLayout>
      </ReactLenis>
    </>
  );
}

export default App;

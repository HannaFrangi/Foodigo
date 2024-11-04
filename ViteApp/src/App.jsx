import React from "react";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthPage from "./pages/Auth/AuthPage";
import RecipePage from "./pages/Recipe/RecipePage";
import PageLayout from "./layout/PageLayout";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/Profile/ProfilePage";
import Error from "./pages/404/NotFound";

function App() {
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  return (
    <>
      <ReactLenis root>
        <Toaster />
        <PageLayout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </PageLayout>
      </ReactLenis>
    </>
  );
}

export default App;

import React, { useEffect } from "react";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthPage from "./pages/Auth/AuthPage";
import RecipePage from "./pages/Recipe/RecipePage";
import PageLayout from "./layout/PageLayout";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/Profile/ProfilePage";
import Error from "./pages/404/NotFound";
import Favorites from "./pages/Favorites/Favorites";
import { useUserStore } from "./source/useAuthStore";

function App() {
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  const { checkAuth, authUser, loading } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return null;

  return (
    <>
      <ReactLenis root>
        <Toaster />
        <PageLayout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/auth"
              element={!authUser ? <AuthPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/recipe"
              element={authUser ? <RecipePage /> : <Navigate to={"/auth"} />}
            />
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to={"/auth"} />}
            />
            <Route
              path="/favorites"
              element={authUser ? <Favorites /> : <Navigate to={"/auth"} />}
            />
            <Route path="/*" element={<Error />} />
          </Routes>
        </PageLayout>
      </ReactLenis>
    </>
  );
}

export default App;

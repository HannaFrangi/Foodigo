import React, { useEffect } from "react";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";
import { Route, Routes, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AuthPage from "./pages/Auth/AuthPage";
import RecipePage from "./pages/Recipe/RecipePage";
import PageLayout from "./layout/PageLayout";
import Homepage from "./pages/Homepage";
import Error from "./pages/404/NotFound";
import Favorites from "./pages/Favorites/Favorites";
import { useAuthStore } from "./store/useAuthStore";
import { useRecipeStore } from "./store/useRecipeStore";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import RecipeDetails from "./pages/Recipe/RecipeDetails";
function App() {
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  const { checkAuth, authUser, loading } = useAuthStore();
  const { fetchCategories } = useRecipeStore();

  useEffect(() => {
    checkAuth();
    if (authUser && !authUser.isVerified) {
      toast("Don't forget to verify your account!", {
        icon: "⚠",
        style: {
          borderRadius: "10px",
          // background: "#333",
          // color: "#fff",
          zIndex: 300,
        },
      });
    }

    fetchCategories();
  }, [checkAuth]);

  //Majd he le heta ??? idk shu bta3mul bas neyka l dene
  // if (loading) return null;

  return (
    <>
      <Toaster />
      <ReactLenis root>
        <PageLayout authUser={authUser}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/auth"
              element={authUser ? <Navigate to="/" /> : <AuthPage />}
            />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </PageLayout>
      </ReactLenis>
    </>
  );
}

export default App;

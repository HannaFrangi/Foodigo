import React, { useEffect, lazy, Suspense } from "react";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";
import { Route, Routes, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getToken, onMessage } from "firebase/messaging";
import AuthPage from "./pages/Auth/AuthPage";
import RecipePage from "./pages/Recipe/RecipePage";
import PageLayout from "./layout/PageLayout";
import Homepage from "./pages/Homepage";
import Error from "./pages/404/NotFound";
import Favorites from "./pages/Favorites/Favorites";
import { useAuthStore } from "./store/useAuthStore";
import { useRecipeStore } from "./store/useRecipeStore";
import TagManager from "react-gtm-module";
import ChefHatSpinner from "./utils/ChefHatSpinner";
import RecipeDetails from "./pages/Recipe/RecipeDetails";
import RecipeHeader from "./components/RecipeDetails/RecipeHeader";
import { messaging } from "./utils/firebase";

const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail"));
const AddRecipe = lazy(() => import("./pages/AddRecipe/AddRecipe"));
const GrocceryList = lazy(() => import("./pages/Groccery/GrocceryList"));
const EditRecipePage = lazy(() => import("./pages/Recipe/EditRecipePage"));

function App() {
  const { checkAuth, authUser, loading } = useAuthStore();
  const { fetchCategories } = useRecipeStore();

  const lenis = useLenis(({ scroll }) => {});

  useEffect(() => {
    checkAuth();
    fetchCategories();
    if (authUser && !authUser.isVerified) {
      toast("Don't forget to verify your account!", {
        icon: "⚠",
        style: { borderRadius: "10px", zIndex: 300 },
      });
    }
  }, [checkAuth, fetchCategories, authUser]);

  // Function to request notification permissions and handle the FCM token
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");

        // Get FCM Token
        const token = await getToken(messaging, {
          vapidKey:
            "BHeUXSawvudM9P0Ei0ON4luJSTttFSiyihWHF7F-9jK1P2o9I4XYHaCHT2_mw8BbHgABaWgfrEhadFIX7KVjzCQ",
        });
        if (token) {
          console.log("FCM Token:", token);
          // Send this token to your server to subscribe to notifications
        }
      } else {
        console.error("Notification permission not granted.");
      }
    } catch (error) {
      console.error("Error getting notification permission:", error);
    }
  };

  useEffect(() => {
    // Initialize Google Tag Manager
    const tagManagerArgs = { gtmId: "GTM-PXV2ZMZW" };
    TagManager.initialize(tagManagerArgs);
    // Request Notification Permission
    requestNotificationPermission();

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);

      // Use toast to show the notification instead of alert
      toast(payload.notification.body, {
        icon: "🔔", // You can customize this as needed
        style: { borderRadius: "10px", zIndex: 300 },
      });
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Toaster />
      <ReactLenis options={{ duration: 2 }} root>
        <PageLayout authUser={authUser} loading={loading}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/auth"
              element={authUser ? <Navigate to="/" /> : <AuthPage />}
            />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/recipe/:recipeId" element={<RecipeHeader />} />
            <Route
              path="/edit/:recipeId"
              element={
                <Suspense fallback={<ChefHatSpinner size={258} />}>
                  <EditRecipePage />
                </Suspense>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <Suspense fallback={<ChefHatSpinner size={258} />}>
                  <ResetPassword />
                </Suspense>
              }
            />
            <Route
              path="/verify-email/:token"
              element={
                <Suspense fallback={<ChefHatSpinner size={258} />}>
                  <VerifyEmail />
                </Suspense>
              }
            />
            <Route
              path="/recipes/new"
              element={
                <Suspense fallback={<ChefHatSpinner size={258} />}>
                  <AddRecipe />
                </Suspense>
              }
            />
            <Route
              path="/groccery"
              element={
                <Suspense fallback={<ChefHatSpinner size={258} />}>
                  <GrocceryList />
                </Suspense>
              }
            />
            <Route path="/*" element={<Error />} />
          </Routes>
        </PageLayout>
      </ReactLenis>
    </>
  );
}

export default App;

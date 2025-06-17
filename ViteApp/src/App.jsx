// 1. LAZY LOAD MORE COMPONENTS
import React, { useEffect, lazy, Suspense } from 'react';
import ReactLenis, { useLenis } from '@studio-freight/react-lenis';
import { Route, Routes, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ChefHatSpinner from './utils/ChefHatSpinner';

// Lazy load ALL page components
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const RecipePage = lazy(() => import('./pages/Recipe/RecipePage'));
const Homepage = lazy(() => import('./pages/Homepage'));
const Error = lazy(() => import('./pages/404/NotFound'));
const Favorites = lazy(() => import('./pages/Favorites/Favorites'));
const RecipeDetails = lazy(() => import('./pages/Recipe/RecipeDetails'));
const RecipeHeader = lazy(() =>
  import('./components/RecipeDetails/RecipeHeader')
);
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'));
const AddRecipe = lazy(() => import('./pages/AddRecipe/AddRecipe'));
const GrocceryList = lazy(() => import('./pages/Groccery/GrocceryList'));
const EditRecipePage = lazy(() => import('./pages/Recipe/EditRecipePage'));

// Lazy load layout if possible
const PageLayout = lazy(() => import('./layout/PageLayout'));

// Dynamic imports for stores (load only when needed)
const useAuthStore = lazy(() =>
  import('./store/useAuthStore').then((m) => ({ default: m.useAuthStore }))
);
const useRecipeStore = lazy(() =>
  import('./store/useRecipeStore').then((m) => ({ default: m.useRecipeStore }))
);

function App() {
  // Move heavy operations to lazy chunks
  useEffect(() => {
    // Lazy load GTM
    import('react-gtm-module').then((TagManager) => {
      TagManager.default.initialize({ gtmId: 'GTM-PXV2ZMZW' });
    });

    // Lazy load stores and execute
    Promise.all([
      import('./store/useAuthStore'),
      import('./store/useRecipeStore'),
    ]).then(([authStore, recipeStore]) => {
      const { checkAuth, authUser } = authStore.useAuthStore();
      const { fetchCategories } = recipeStore.useRecipeStore();

      checkAuth();
      fetchCategories();

      if (authUser && !authUser.isVerified) {
        toast("Don't forget to verify your account!", {
          icon: '⚠',
          style: { borderRadius: '10px', zIndex: 300 },
        });
      }
    });
  }, []);

  return (
    <>
      <Toaster />
      <Suspense fallback={<ChefHatSpinner size={258} />}>
        <ReactLenis options={{ duration: 2 }} root>
          <Suspense fallback={<ChefHatSpinner size={100} />}>
            <PageLayout>
              <Routes>
                <Route
                  path='/'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <Homepage />
                    </Suspense>
                  }
                />
                <Route
                  path='/auth'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <AuthPage />
                    </Suspense>
                  }
                />
                <Route
                  path='/recipe'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <RecipePage />
                    </Suspense>
                  }
                />
                <Route
                  path='/favorites'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <Favorites />
                    </Suspense>
                  }
                />
                <Route
                  path='/recipe/:id'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <RecipeDetails />
                    </Suspense>
                  }
                />
                <Route
                  path='/recipe/:recipeId'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <RecipeHeader />
                    </Suspense>
                  }
                />
                <Route
                  path='/edit/:recipeId'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <EditRecipePage />
                    </Suspense>
                  }
                />
                <Route
                  path='/reset-password/:token'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <ResetPassword />
                    </Suspense>
                  }
                />
                <Route
                  path='/verify-email/:token'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <VerifyEmail />
                    </Suspense>
                  }
                />
                <Route
                  path='/recipes/new'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <AddRecipe />
                    </Suspense>
                  }
                />
                <Route
                  path='/groccery'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <GrocceryList />
                    </Suspense>
                  }
                />
                <Route
                  path='/*'
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <Error />
                    </Suspense>
                  }
                />
              </Routes>
            </PageLayout>
          </Suspense>
        </ReactLenis>
      </Suspense>
    </>
  );
}

export default App;

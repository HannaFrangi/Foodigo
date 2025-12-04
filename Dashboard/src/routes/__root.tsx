import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@/components/ui/sonner';
import { NavigationProgress } from '@/components/navigation-progress';
import GeneralError from '@/features/errors/general-error';
import NotFoundError from '@/features/errors/not-found-error';
import { useInitializeAuth } from '@/stores/authStore';
import { useEffect } from 'react';

// Component to initialize auth data on app load
const AuthInitializer = () => {
  const { initialize } = useInitializeAuth();

  useEffect(() => {
    // Initialize auth data from localStorage/cookies on app load
    initialize();
  }, [initialize]);

  return null;
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    return (
      <>
        <AuthInitializer />
        <NavigationProgress />
        <Outlet />
        <Toaster duration={2000} visibleToasts={2} />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    );
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});

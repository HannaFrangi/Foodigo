import { createFileRoute, redirect } from '@tanstack/react-router';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState();

    // Check if access token exists
    if (!auth.accessToken) {
      toast.error('No Token Found! Redirecting to login...');
      throw redirect({ to: '/sign-in' });
    }
  },
  component: AuthenticatedLayout,
});

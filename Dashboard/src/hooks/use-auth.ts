import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    _id: string;
    email: string;
    name: string;
    ProfilePicURL: string;
  }
}

interface User {
  name: string;
  email: string;
  image: string;
  id : string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: (data: LoginResponse) => {
      const userData: User = {
        id: data.user._id, 
        name: data.user.name,
        email: data.user.email,
        image: data.user.ProfilePicURL,
      };


   auth.setUser(userData);

      toast.success('Login successful!');

      // Navigate to dashboard
      navigate({ to: '/' });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const logout = () => {
    // Clear from auth store (this automatically clears localStorage/cookies)
    auth.reset();
    navigate({ to: '/sign-in' });
    toast.success('Logged out successfully');
  };

  // Initialize auth state from localStorage on hook creation
  const initializeAuth = async () => {
    // The auth store already handles initialization from cookies/localStorage
    // If we have a token but no user, try to fetch user data
    if (auth.accessToken && !auth.user && !auth.isLoading) {
      await auth.fetchUser();
    }
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout,
    user: auth.user,
    isAuthenticated: !!auth.accessToken,
    isLoading: auth.isLoading,
    // Helper function to manually sync from localStorage if needed
    initializeAuth,
  };
};

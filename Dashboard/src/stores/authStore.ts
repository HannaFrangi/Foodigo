import Cookies from 'js-cookie';
import { create } from 'zustand';

const FOODIGO_ACCESS_TOKEN = 'jwt_token';
const FOODIGO_USER_DATA = 'userData';

interface AuthUser {
  name: string;
  email: string;
  image: string;
  id : string;
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
    fetchUser: () => Promise<void>;
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
  };
}

// Helper functions for user data persistence using localStorage
const userStorage = {
  save: (user: AuthUser) => {
    try {
      localStorage.setItem(FOODIGO_USER_DATA, JSON.stringify(user));
      console.log('User data saved to localStorage:', user);
    } catch (error) {
      console.error('Failed to save user data to localStorage:', error);
    }
  },

  get: (): AuthUser | null => {
    try {
      const userData = localStorage.getItem(FOODIGO_USER_DATA);
      const user = userData ? JSON.parse(userData) : null;
      console.log('User data retrieved from localStorage:', user);
      return user;
    } catch (error) {
      console.error('Failed to get user data from localStorage:', error);
      return null;
    }
  },

  remove: () => {
    try {
      localStorage.removeItem(FOODIGO_USER_DATA);
      console.log('User data removed from localStorage');
    } catch (error) {
      console.error('Failed to remove user data from localStorage:', error);
    }
  },
};

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieState = Cookies.get('jwt_token');
  console.log('Access token from cookies:', cookieState);
  const initToken = cookieState ?? '';
  const savedUser = userStorage.get();

  console.log('Auth store initialization:', {
    hasToken: !!initToken,
    savedUser,
  });

  return {
    auth: {
      user: savedUser,
      isLoading: false,

      setUser: (user) => {
        set((state) => ({ ...state, auth: { ...state.auth, user } }));
        if (user) {
          userStorage.save(user);
        } else {
          userStorage.remove();
        }
      },

      accessToken: initToken,

      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(FOODIGO_ACCESS_TOKEN, accessToken);
          return { ...state, auth: { ...state.auth, accessToken } };
        }),

      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(FOODIGO_ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: '' } };
        }),

      reset: () =>
        set((state) => {
          Cookies.remove(FOODIGO_ACCESS_TOKEN);
          userStorage.remove();
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              isLoading: false,
            },
          };
        }),

      setLoading: (loading) =>
        set((state) => ({
          ...state,
          auth: { ...state.auth, isLoading: loading },
        })),

      fetchUser: async () => {
        const { accessToken } = get().auth;

        if (!accessToken) {
          console.warn('No access token available to fetch user');
          return;
        }

        try {
          set((state) => ({
            ...state,
            auth: { ...state.auth, isLoading: true },
          }));

          // Replace this URL with your actual user endpoint
          const response = await fetch('/api/user/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const userData = await response.json();

          // Transform the API response to match your AuthUser interface
          const user: AuthUser = {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            image: userData.profilePicURL || '/avatars/shadcn.jpg',
          };

        
          get().auth.setUser(user);
        } catch (error) {
          console.error('Failed to fetch user:', error);

          // If fetch fails due to invalid token, reset auth
          if (error instanceof Error && error.message.includes('401')) {
            get().auth.reset();
          }
        } finally {
          set((state) => ({
            ...state,
            auth: { ...state.auth, isLoading: false },
          }));
        }
      },
    },
  };
});

// Utility hook to initialize auth on app start
export const useInitializeAuth = () => {
  const { auth } = useAuthStore();

  const initialize = async () => {
    console.log('Initializing auth data:', {
      hasToken: !!auth.accessToken,
      hasUser: !!auth.user,
      isLoading: auth.isLoading,
    });

    if (auth.accessToken && !auth.user && !auth.isLoading) {
      console.log('Fetching user data from API...');
      await auth.fetchUser();
    } else {
      console.log('Auth data already initialized or no token available');
    }
  };

  return { initialize };
};

// Export the auth selector for convenience
export const useAuth = () => useAuthStore((state) => state.auth);

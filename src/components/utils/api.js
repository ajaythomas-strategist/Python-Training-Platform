import { useStore } from '../../store/useStore';

export const baseUrl = `http://localhost:5000`; // Removed trailing slash for cleaner URL building

// Create a centralized fetch interceptor to handle Authorization and 401s
const originalFetch = window.fetch;

window.fetch = async (input, init) => {
  let url = typeof input === 'string' ? input : input.url;

  // Intercept requests going to our API
  if (url.includes('/api/')) {
    const state = useStore.getState();
    const token = state.token;

    init = init || {};
    init.headers = init.headers ? new Headers(init.headers) : new Headers();

    // Automatically attach token if available and not already set
    if (token && !init.headers.has('Authorization')) {
      init.headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await originalFetch(input, init);

      // Global 401 Unauthorized handling
      if (response.status === 401) {
        state.logout();
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Pass through non-API requests natively
  return originalFetch(input, init);
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiOptions extends RequestInit {
  body?: any;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Base API utility for E-Strategist
 * Handles common fetch configurations, headers, and error handling.
 */
const api = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = 'GET', body, headers = {}, ...customConfig } = options;

  // Get token from localStorage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 Unauthorized (optional: redirect to login)
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('token');
        // window.location.href = '/auth/signin';
      }
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let errorData: any = {};
      try {
        errorData = text ? JSON.parse(text) : {};
      } catch (e) {
        errorData = { message: text };
      }
      
      const error = new Error(errorData.message || 'API Request failed') as ApiError;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Return null for 204 No Content
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('Content-Type');
    const text = await response.text();
    
    if (!text) {
      return null;
    }

    if (contentType && contentType.includes('application/json')) {
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    }

    return text;
  } catch (error: any) {
    console.error(`API Error [${method}] ${endpoint}:`, error.message);
    throw error;
  }
};

// Convenience methods
api.get = (endpoint: string, options: ApiOptions = {}) => api(endpoint, { ...options, method: 'GET' });
api.post = (endpoint: string, body?: any, options: ApiOptions = {}) => api(endpoint, { ...options, method: 'POST', body });
api.put = (endpoint: string, body?: any, options: ApiOptions = {}) => api(endpoint, { ...options, method: 'PUT', body });
api.patch = (endpoint: string, body?: any, options: ApiOptions = {}) => api(endpoint, { ...options, method: 'PATCH', body });
api.delete = (endpoint: string, options: ApiOptions = {}) => api(endpoint, { ...options, method: 'DELETE' });

export default api;

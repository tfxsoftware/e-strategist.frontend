import api from './api';

export const authService = {
  signup: async (userData: any) => {
    return await api.post('/auth/signup', userData);
  },

  signin: async (credentials: any) => {
    return await api.post('/auth/signin', credentials);
  },
};

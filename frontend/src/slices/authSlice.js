import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: (() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données userInfo:', error);
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout(state) {
      state.userInfo = null;
      localStorage.removeItem('userInfo'); // Supprime uniquement `userInfo` au lieu de tout vider
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

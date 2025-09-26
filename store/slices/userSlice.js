import { createSlice } from '@reduxjs/toolkit';

// Helper functions for localStorage
const saveUserToLocalStorage = (userData) => {
  try {
    localStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

const loadUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
    return null;
  }
};

// Initial state - load from localStorage if available
const initialState = {
  userData: loadUserFromLocalStorage() || null,
  isAuthenticated: !!loadUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;

      // Save to localStorage for persistence
      saveUserToLocalStorage(action.payload);

      // Console log the stored information as requested
      console.log('User data stored in Redux:', action.payload);
      console.log('User ID:', action.payload.id);
      console.log('User Type:', action.payload.user_type);
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      try {
        localStorage.removeItem('userData');
      } catch (error) {
        console.error('Error removing user data from localStorage:', error);
      }

      console.log('User data cleared from Redux and localStorage');
    },
    updateUserData: (state, action) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };

        // Update localStorage
        saveUserToLocalStorage(state.userData);

        console.log('User data updated in Redux:', state.userData);
      }
    },
  },
});

export const { setUserData, clearUserData, updateUserData } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.userData;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserId = (state) => state.user.userData?.id;
export const selectUserType = (state) => state.user.userData?.user_type;

export default userSlice.reducer;

import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectUserId,
  selectUserType,
} from '../store/slices/userSlice';

// Custom hook to easily access user data throughout the app
export const useAuth = () => {
  const userData = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  return {
    userData,
    isAuthenticated,
    userId,
    userType,
    // Helper functions
    isSuperAdmin: userType === 'super_admin',
    isAdmin: userType === 'admin',
  };
};

# Redux User State Management Setup

## Overview

This setup stores complete user information from your API response in Redux state and localStorage, ensuring data persists across page refreshes.

## API Response Structure

```javascript
{
  "id": 3,
  "email": "superadmin@example.com",
  "name": "Super Admin 1",
  "phone": "+8801700000000",
  "user_type": "super_admin",
  "created_at": "2025-09-22T21:20:12.881804",
  "updated_at": "2025-09-22T21:20:12.881823",
  "authorized_by": null
}
```

## How to Use

### 1. Using useSelector directly in any component:

```javascript
import { useSelector } from "react-redux";
import {
  selectUser,
  selectUserId,
  selectUserType,
} from "../store/slices/userSlice";

function MyComponent() {
  const userData = useSelector(selectUser);
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  return <div>User: {userData?.name}</div>;
}
```

### 2. Using the custom hook (Recommended):

```javascript
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { userData, userId, userType, isSuperAdmin, isAdmin, isAuthenticated } =
    useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome {userData.name}!</div>;
}
```

### 3. Dispatching actions:

```javascript
import { useDispatch } from "react-redux";
import {
  setUserData,
  clearUserData,
  updateUserData,
} from "../store/slices/userSlice";

function MyComponent() {
  const dispatch = useDispatch();

  // Set user data (automatically console logs and saves to localStorage)
  const handleLogin = (apiResponse) => {
    dispatch(setUserData(apiResponse));
  };

  // Clear user data (logout)
  const handleLogout = () => {
    dispatch(clearUserData());
  };

  // Update specific user fields
  const handleUpdate = (updates) => {
    dispatch(updateUserData(updates));
  };
}
```

## Key Features

### ✅ Persistence Across Refreshes

- Data is automatically saved to localStorage when stored in Redux
- Data is automatically loaded from localStorage when the app starts
- No more losing user data on page refresh!

### ✅ Automatic Console Logging

- Every time user data is set, it automatically console logs:
  - Complete user data object
  - User ID
  - User Type
- You can see these logs in your browser's developer console

### ✅ Easy Access Throughout App

- Use the `useAuth()` hook anywhere in your app
- Get specific pieces of data with selectors
- Check authentication status easily

### ✅ Type-Safe Helpers

- `isSuperAdmin` - boolean for super_admin check
- `isAdmin` - boolean for admin check
- `isAuthenticated` - boolean for login status

## Testing the Setup

1. Visit any dashboard page
2. Open browser developer console
3. Look for console logs showing your user data
4. Refresh the page - data should still be there!
5. Visit `/dashboard/profile` to see the UserInfo component

## Important Notes

- User ID and user_type are specifically highlighted in console logs as requested
- All original API data is preserved in the Redux store
- Data automatically clears when you logout
- Works seamlessly with your existing authentication flow

"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectUserId,
  selectUserType,
  selectIsAuthenticated,
} from "../store/slices/userSlice";
import { useAuth } from "../hooks/useAuth";

export default function UserInfo() {
  const dispatch = useDispatch();

  // Method 1: Using useSelector directly
  const userData = useSelector(selectUser);
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Method 2: Using custom hook (recommended)
  const {
    userData: userDataFromHook,
    userId: userIdFromHook,
    userType: userTypeFromHook,
    isSuperAdmin,
    isAdmin,
  } = useAuth();

  if (!isAuthenticated || !userData) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>User not authenticated or data not loaded yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">User Information</h2>

      <div className="space-y-2 mb-4">
        <p>
          <strong>ID:</strong> {userData.id}
        </p>
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Phone:</strong> {userData.phone}
        </p>
        <p>
          <strong>User Type:</strong> {userData.user_type}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(userData.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(userData.updated_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Is Super Admin:</strong> {isSuperAdmin ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
        </p>
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> This data persists across page refreshes
          because it&apos;s stored in both Redux and localStorage. Try
          refreshing the page and the data will still be available!
        </p>
      </div>
    </div>
  );
}

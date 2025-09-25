import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

const LogoutForm: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("refreshToken");
      await fetch("https://pension-mgt-backend.onrender.com/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      // Clear tokens from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // Redirect to dashboard page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Logout
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutForm;

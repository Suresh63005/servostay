import React, { useState } from "react";
import { NotificationIcon, ProfileIcon } from "./Icons";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/api";

const Header = () => {
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      await api.post(`/admin/logout`, {});
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error during logout:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigation = (data) => {
    if (data === "profile") {
      navigate("/profile");
    } else if (data === "settings") {
      navigate("/settings");
    }
  };

  return (
    <div className="bg-white h-[65px] sm:h-[80px] px-4 py-4 sm:px-6 flex items-center justify-between relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-100 z-50">
          <span className="loader"></span>
        </div>
      )}

      {/* Title Section */}
      <div className="flex items-center gap-2.5">
        <span className="text-lg sm:text-2xl font-bold">Dashboard</span>
      </div>
      <div>
        <Toaster position="top-right" />
      </div>
      {/* Icons Section */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative">
          <div className="bg-[#f7fbff] rounded-full w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer">
            <NotificationIcon />
          </div>
        </div>

        {/* Profile Icon with Smooth Hover Card */}
        <div
          className="relative"
          onMouseEnter={() => setShowCard(true)}
          onMouseLeave={() => setShowCard(false)}
        >
          <div className="bg-[#f7fbff] rounded-full w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110">
            <ProfileIcon />
          </div>

          {showCard && (
            <div
              className="absolute top-14 right-0 w-[240px] bg-white border border-gray-200 rounded-lg shadow-xl z-10 transition-all duration-300 transform scale-100"
            >
              <ul className="py-3 divide-y divide-gray-200">
                <li
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  onClick={() => {
                    navigation("profile");
                  }}
                >
                  <FaUser className="text-blue-500" /> <span>Account</span>
                </li>
                <li
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  onClick={logout}
                >
                  <FaSignOutAlt className="text-red-500" /> <span>Logout</span>
                </li>
                <li
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  onClick={() => {
                    navigation("settings");
                  }}
                >
                  <FaCog className="text-green-500" /> <span>Settings</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
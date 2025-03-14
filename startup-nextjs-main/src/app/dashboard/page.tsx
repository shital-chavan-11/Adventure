"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Hotel, PartyPopper, Map, Moon, Sun, User, LogOut } from "lucide-react";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
  
      if (!refreshToken) {
        alert("No active session found!");
        return;
      }
  
      const response = await fetch("http://127.0.0.1:8000/trip/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
  
      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
  
        console.log("Logout successful, redirecting...");
        router.push("/"); // ✅ Redirect to index page
        router.refresh(); // ✅ Force reload to clear any stored data
      } else {
        console.error("Logout failed:", await response.json());
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out.");
    }
  };
  

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-lg fixed h-full">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <Home size={20} /> <span>Home</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <Hotel size={20} /> <span>Hotel Booking</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <PartyPopper size={20} /> <span>Parties</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <Map size={20} /> <span>Guide</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Top Right Section - Profile & Dark Mode */}
        <div className="flex justify-end items-center space-x-4 mb-6">
          {/* Dark Mode Toggle */}
          <button
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            {/* Profile Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <User size={24} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-md rounded-lg p-2">
                <button
  onClick={() => router.push("/dashboard/profile")} // ✅ Navigate to Profile Page
  className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg gap-2"
>
  <User size={20} />
  Profile
</button>

                <button
  onClick={handleLogout} // ✅ Logout on click
  className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg gap-2"
>
  <LogOut size={20} />
  Logout
</button>


              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
          <p>Explore your bookings, parties, and guides here.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

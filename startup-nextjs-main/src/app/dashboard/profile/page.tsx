 "use client";

import { useState } from "react";
import { User, Mail, Phone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  return (
    <div className={`flex flex-col items-center min-h-screen p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="self-start mb-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </button>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <User size={60} className="text-gray-500 dark:text-gray-300" />
          <h2 className="text-2xl font-semibold mt-4">John Doe</h2>
          <p className="text-gray-600 dark:text-gray-400">Tourist & Travel Enthusiast</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-gray-500 dark:text-gray-300" />
            <span className="text-lg">john.doe@example.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-gray-500 dark:text-gray-300" />
            <span className="text-lg">+1 234 567 890</span>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          className="mt-6 w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
};

export default Profile;

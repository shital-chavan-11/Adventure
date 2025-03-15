"use client";

import { useState, useEffect } from "react";
import { UserCircle, Mail, Phone, MapPin, ArrowLeft, Edit2, Moon, Sun ,User } from "lucide-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const [editedProfile, setEditedProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    bio: "",
  });

  const BACKEND_URL = "http://127.0.0.1:8000/trip/profile/";

  // Load dark mode preference
  

  // Function to toggle dark mode
   
  // Load profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not logged in!");
          return;
        }

        const response = await fetch(BACKEND_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data);
        setEditedProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle form field updates
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value, // Dynamically update the changed field
    }));
  };

  // Handle profile update (PUT request)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      const response = await fetch(BACKEND_URL, {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedProfile),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setProfile(editedProfile); // Update local state
        setIsModalOpen(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <div className="flex">
      {/* Sidebar Section */}
      <div className="w-1/4 h-screen bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
        >
          <ArrowLeft size={20} className="mr-2" />
        </button>

        {/* Profile Picture */}
        {profile?.profile_image ? (
          <img
            src={`http://127.0.0.1:8000${profile.profile_image}`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 dark:border-gray-500"
          />
        ) : (
          <UserCircle size={112} className="text-gray-500 dark:text-gray-300" />
        )}

        {/* Profile Name */}
        <h2 className="text-xl font-semibold mt-4">
          {profile?.first_name} {profile?.last_name}
        </h2>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {profile?.bio || "Tourist & Travel Enthusiast"}
        </p>

         

        {/* Profile Details (Read-Only) */}
        <div className="mt-6 space-y-4 w-full">
      

  <div className="flex items-center space-x-3">
    <Mail size={20} />
    <input
      type="email"
      value={profile?.email || ""}
      disabled
      className="border rounded p-1 w-full dark:bg-gray-800"
    />
  </div>

  {/* Phone Number (Read-Only) */}
  <div className="flex items-center space-x-3">
    <Phone size={20} />
    <input
      type="text"
      value={profile?.phone_number || ""}
      disabled
      className="border rounded p-1 w-full dark:bg-gray-800"
    />
  </div>
  {/* Address (Read-Only) */}
  <div className="flex items-center space-x-3">
    <MapPin size={20} />
    <input
      type="text"
      value={profile?.address || ""}
      disabled
      className="border rounded p-1 w-full dark:bg-gray-800"
    />
  </div>
</div>
<button
  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  onClick={() => {
    console.log("Edit button clicked");
    setIsModalOpen(true);
  }}
>
  <Edit2 size={16} className="inline mr-2" /> Edit Profile
</button>


</div>
 

     {/* Profile Edit Modal (Popup Form) */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <div className="space-y-3">
        <input
          type="text"
          name="first_name"
          value={editedProfile.first_name || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="First Name"
        />
        <input
          type="text"
          name="last_name"
          value={editedProfile.last_name || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Last Name"
        />
        <input
          type="email"
          name="email"
          value={editedProfile.email || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Email"
        />
        <input
          type="text"
          name="phone_number"
          value={editedProfile.phone_number || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Phone Number"
        />
        <input
          type="text"
          name="address"
          value={editedProfile.address || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Address"
        />

        {/* Bio Field (Newly Added) */}
        <textarea
          name="bio"
          value={editedProfile.bio || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded h-20"
          placeholder="Write your bio..."
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsModalOpen(false)}
          className="mr-2 px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

<div className="w-3/4 h-screen relative bg-gray-900 text-white">
          {/* This area remains empty with a dark theme */}
        </div>
    </div>
  );
};

export default Profile;

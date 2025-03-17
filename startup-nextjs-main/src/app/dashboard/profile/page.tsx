"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Mail, MapPin, Phone, UserCircle } from "lucide-react";

const Profile = ({ Profile }) => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]); // ✅ State for storing stories
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0); // ✅ Track current story
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [storyImage, setStoryImage] = useState(null);
  const [storyVideo, setStoryVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState(""); // ✅ Define comment state
const [comments, setComments] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [users, setUsers] = useState([]);  // ✅ Store multiple comments
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState({});
  const [hasStory, setHasStory] = useState(profile?.story ? true : false);
  const [editedProfile, setEditedProfile] = useState(profile || {});
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const storyID = typeof window !=="undefined" ?localStorage.getItem("storyID"):null;
  const [isStoryViewModalOpen, setIsStoryViewModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const openStoryViewModal = () => setIsStoryViewModalOpen(true);
  const closeStoryViewModal = () => setIsStoryViewModalOpen(false);
  const openCreateStoryModal = () => setIsCreateStoryModalOpen(true);
  const closeCreateStoryModal = () => setIsCreateStoryModalOpen(false);
  const handleOpenCreateStoryModal = () => setIsCreateStoryModalOpen(true);
  const handleCloseCreateStoryModal = () => setIsCreateStoryModalOpen(false);


  
    // ✅ Fetch Profile from Backend
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/trip/profile/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          setProfile(data);
          setEditedProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
    
    
      fetchProfile();
    }, []); // Ensure empty dependency array to run once
    const handleLike = async () => {
      setLoading(true); // Start loading state
      try {
        const response = await fetch(`http://127.0.0.1:8000/trip/story/${storyID}/like/`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token from localStorage
            },
            body: JSON.stringify({}), // Send empty body if no extra data is needed
          }
        );
    
        if (response.ok) {
          const data = await response.json();
          if (data.message === 'You liked the story') {
            setLiked(true);  // Liked the story
          } else if (data.message === 'You unliked the story') {
            setLiked(false);  // Unliked the story
          }
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };
    
    const handleProfileClick = (user) => {
      setSelectedUser(user);
    };
     
  
    
    const handleCommentSubmit = async () => {
      if (comment.trim() !== "") {
        // Start loading state
        setLoading(true);
        try {
          const response = await fetch(`http://127.0.0.1:8000/trip/story/${storyID}/comments/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send JWT token
            },
            body: JSON.stringify({ text: comment }), // Send the comment as part of the request body
          });
    
          if (response.ok) {
            const data = await response.json(); // Parse the response as JSON
            setComments([...comments, data.comment]); // Add new comment to the list (based on backend response)
            setComment(""); // Clear input field
          } else {
            const data = await response.json();
            if (data.error && data.error === "You cannot comment on your own story.") {
              alert(data.error);  // Show error message if user tries to comment on their own story
            } else {
              console.error("Failed to submit comment");
            }
          }
        } catch (error) {
          console.error("Error submitting comment:", error);
        } finally {
          setLoading(false); // Stop loading state
        }
      }
    };
    
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/trip/story/${storyID}/comments/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Comments: ", data);
          setComments(data);  // Set fetched comments to the state
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };


const handleStorySubmit = async () => {
  // Ensure token exists
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User is not authenticated.");
    return;
  }

  const formData = new FormData();
  formData.append("text", storyText);
  if (storyImage) formData.append("image", storyImage);
  if (storyVideo) formData.append("video", storyVideo);

  try {
    const response = await fetch("http://127.0.0.1:8000/trip/stories/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Ensure token is valid
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();

      // Save the story ID
      localStorage.setItem("storyID", data.story_id);

      console.log("Story submitted successfully!");

      // Close modal and reset form
      setIsCreateStoryModalOpen(false);
      setStoryText("");
      setStoryImage(null);
      setStoryVideo(null);
    } else {
      const errorText = await response.text();
      console.error("Failed to submit story:", errorText);
    }
  } catch (error) {
    console.error("Error submitting story:", error);
  }
};

  const handleStoryView = async () => {
    const userId = localStorage.getItem("userId"); // Ensure userId is retrieved properly
  
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found");
        return;
      }
  
      const response = await fetch(`http://127.0.0.1:8000/trip/stories/user/${userId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        console.error("Failed to fetch stories. Status:", response.status);
        return;
      }
  
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setStories(data);
        setCurrentStoryIndex(0);
        setIsStoryViewModalOpen(true);
      } else {
        console.warn("No stories found for this user");
        setStories([]);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };
  useEffect(() => {
    fetchUsersWithStories();
  }, []);

  const fetchUsersWithStories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/trip/users_with_stories/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Users with Stories: ", data);

        const initialIndexes = {};
        data.forEach((user) => {
          if (user.stories.length > 0) {
            initialIndexes[user.user_id] = 0;
          }
        });

        setCurrentStoryIndex(initialIndexes);
        setUsers(data);
      } else {
        console.error("Failed to fetch users with stories");
      }
    } catch (error) {
      console.error("Error fetching users with stories:", error);
    }
  };

  const handleStoryClick = (userId) => {
    setSelectedUser(userId);
  };

  const handleCloseStory = () => {
    setSelectedUser(null);
  };

  const handlePrevUserStory = (userId) => {
    setStoryIndex((prev) => ({
      ...prev,
      [userId]: Math.max(0, (prev[userId] || 0) - 1),
    }));
  };
  
  const handleNextUserStory = (userId, totalStories) => {
    setStoryIndex((prev) => ({
      ...prev,
      [userId]: Math.min(totalStories - 1, (prev[userId] || 0) + 1),
    }));
  };
  
  // ✅ Handle Profile Changes
  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };
  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setIsStoryViewModalOpen(false); // Close modal when last story finishes
    }
  };
  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };
    
  const handleSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/trip/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedProfile),
      });
  
      if (response.ok) {
        console.log("Profile updated successfully!");
        setProfile(editedProfile); // ✅ Update state to reflect changes dynamically
        setIsModalOpen(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  

  return (
    <div className="flex">
      {/* Sidebar Section */}
      <div className="w-1/4 h-screen bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col items-center">
  {/* 🔙 Back Button */}
   <div 
    className="flex items-center cursor-pointer mb-4 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-500 transition duration-200" 
    onClick={() => router.push("/dashboard")}
  >
    <ArrowLeft size={24} className="mr-2" />
    <span className="font-medium"></span>
  </div>
 

  {profile?.profile_image ? (
  <img
    src={`http://127.0.0.1:8000${profile.profile_image}`}
    alt="Profile"
    className={`w-28 h-28 rounded-full object-cover border-4  
      ${stories.length > 0 ? "border-blue-600 dark:border-blue-900" : "border-gray-300 dark:border-gray-500"} 
      cursor-pointer transition`}
    onClick={handleStoryView} // ✅ Opens story modal
  />
) : (
  <UserCircle
    size={112}
    className={`cursor-pointer transition 
      ${stories.length > 0 ? "text-blue-600 dark:text-red-900" : "text-gray-500 dark:text-gray-300"}`}
    onClick={handleStoryView} // ✅ Opens story modal
  />
)}


     


{isCreateStoryModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
      
      {/* Modal Title */}
      <h2 className="text-lg font-semibold mb-4">Add Your Story</h2>

      {/* Story Text Input */}
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Write something..."
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
      />

      {/* Image Upload */}
      <input 
        type="file" 
        accept="image/*" 
        className="mt-2 w-full" 
        onChange={(e) => setStoryImage(e.target.files[0])} 
      />

      {/* Video Upload */}
      <input 
        type="file" 
        accept="video/*" 
        className="mt-2 w-full" 
        onChange={(e) => setStoryVideo(e.target.files[0])} 
      />

      {/* Buttons */}
      <div className="flex justify-end mt-4">
        <button 
          className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500"
          onClick={() => setIsCreateStoryModalOpen(false)} // ✅ Correct function
        >
          Cancel
        </button>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleStorySubmit} // ✅ Submit the story
        >
          Post Story
        </button>
      </div>
      
    </div>
  </div>
)}


        {/* Profile Details */}
        <h2 className="text-xl font-semibold mt-4">{profile?.first_name} {profile?.last_name}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">{profile?.bio || "Tourist & Travel Enthusiast"}</p>

        {/* Profile Details (Read-Only) */}
        <div className="mt-6 space-y-4 w-full">
          <div className="flex items-center space-x-3"><Mail size={20} /><input type="email" value={profile?.email || ""} disabled className="border rounded p-1 w-full dark:bg-gray-800" /></div>
          <div className="flex items-center space-x-3"><Phone size={20} /><input type="text" value={profile?.phone_number || ""} disabled className="border rounded p-1 w-full dark:bg-gray-800" /></div>
          <div className="flex items-center space-x-3"><MapPin size={20} /><input type="text" value={profile?.address || ""} disabled className="border rounded p-1 w-full dark:bg-gray-800" /></div>
        </div>

        {/* Edit Profile Button */}
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>
          <Edit2 size={16} className="inline mr-2" /> Edit Profile
          </button>
         {/* Edit Profile Button */}
 

         <button 
  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center"
  onClick={handleOpenCreateStoryModal} // ✅ Function to open the create story modal
>
  <Edit2 size={16} className="inline mr-2" /> Add Your Story
</button>
 </div>
      
 <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Stories</h2>

      {/* Story Circles */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {users.map((user) =>
          user.stories.length > 0 ? (
            <div key={user.user_id} className="cursor-pointer" onClick={() => handleStoryClick(user.user_id)}>
              <div
                className="relative rounded-full overflow-hidden border-4 border-blue-500 cursor-pointer"
                style={{ width: "110px", height: "110px" }} // Set width and height in px
                >
                {user.profile_photo ? (
                  <img
                    src={`http://127.0.0.1:8000${user.profile_photo}`}
                    alt={`${user.first_name}'s story`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-700 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-center text-sm mt-1">{user.first_name}</p>
            </div>
          ) : null
        )}
      </div>
      {isStoryViewModalOpen && stories.length > 0 && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
    <div className="relative bg-gray-600 p-4 rounded-lg shadow-lg w-[400px] h-[400px] flex flex-col items-center justify-between max-h-screen overflow-hidden">
  
  {/* Close Button */}
  <button className="absolute top-3 right-3 text-white text-2xl" onClick={() => setIsStoryViewModalOpen(false)}>
    &times;
  </button>

  {/* Story Content */}
  <div className="w-full h-[350px] flex flex-col items-center justify-center overflow-hidden">
    {/* Always Display Text First */}
    {stories[currentStoryIndex]?.text && (
      <p className="text-white text-center mb-2">{stories[currentStoryIndex].text}</p>
    )}

    {stories[currentStoryIndex]?.image ? (
      <img
        src={`http://127.0.0.1:8000${stories[currentStoryIndex].image}`}
        alt="User Story"
        className="w-full h-[300px] object-cover rounded-lg"
      />
    ) : stories[currentStoryIndex]?.video ? (
      <video controls className="w-full h-[300px] object-cover rounded-lg">
        <source src={`http://127.0.0.1:8000${stories[currentStoryIndex].video}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : !stories[currentStoryIndex]?.text ? (
      <p className="text-gray-400">No content available</p>
    ) : null}
  </div>

   

  {/* Navigation Buttons */}
  <div className="absolute w-full top-1/2 flex justify-between px-4">
    {currentStoryIndex > 0 && (
      <button
        className="bg-gray-800 bg-opacity-60 text-white text-4xl p-3 rounded-full shadow-lg 
                   hover:bg-gray-900 hover:scale-110 transition-transform duration-300"
        onClick={handlePrevStory}
      >
        &#10094;
      </button>
    )}
    {currentStoryIndex < stories.length - 1 && (
      <button
        className="bg-gray-800 bg-opacity-60 text-white text-4xl p-3 rounded-full shadow-lg 
                   hover:bg-gray-900 hover:scale-110 transition-transform duration-300"
        onClick={handleNextStory}
      >
        &#10095;
      </button>
    )}
  </div>

</div>

  </div>
)}

      {selectedUser !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
    <div className="bg-gray-800 p-6 rounded-lg w-[400px] h-[500px] relative flex flex-col items-center">
      
      {/* Close Button */}
      <button className="absolute top-2 right-2 text-gray-400 text-xl" onClick={handleCloseStory}>✖</button>
      
      {/* Fetch and Display Selected User's Story */}
      {users.find((u) => u.user_id === selectedUser) && (() => {
        const user = users.find((u) => u.user_id === selectedUser);
        const currentIndex = storyIndex[selectedUser] || 0;
        const story = user?.stories[currentIndex];

        return (
          <div className="flex flex-col items-center w-full h-full">
            
            {/* Story Header */}
            <h3 className="text-lg font-semibold text-white">{user?.first_name}'s Story</h3>
            {story?.text && <p className="text-gray-300 text-center px-2">{story.text}</p>}

            {/* Story Content */}
            <div className="w-full h-[350px] flex items-center justify-center bg-black rounded-lg overflow-hidden">
              {story?.image ? (
                <img src={`http://127.0.0.1:8000${story.image}`} alt="Story" className="w-full h-full object-cover" />
              ) : story?.video ? (
                <video controls className="w-full h-full object-cover">
                  <source src={`http://127.0.0.1:8000${story.video}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="text-gray-400">No content available</p>
              )}
            </div>
            
            {/* Like and Comment Section */}
            <div className="w-full p-2 bg-gray-700 rounded-lg mt-2">
              <div className="flex items-center justify-between">
                <button onClick={handleLike} className="text-xl flex items-center transition-colors duration-300">
                  <span className={`transition-colors duration-300 ${liked ? 'text-red-500' : 'text-white'}`}>{liked ? '❤️' : '🤍'}</span>
                  <span className="text-white ml-1">{liked ? 'liked' : 'unlike'}</span>
                </button>
              </div>

              {/* Comment Input */}
              <div className="mt-2">
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="w-full px-2 py-1 text-black rounded" />
                <button onClick={handleCommentSubmit} className="w-full mt-1 bg-blue-500 text-white p-1 rounded">Post Comment</button>
              </div>

              {/* Comments Section */}
              <div className="mt-2 max-h-[100px] overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((cmt, index) => (
                    <div key={index} className="text-white text-sm border-b border-gray-500 py-1">
                      <p><strong>{cmt.first_name}</strong> - {cmt.text}</p>
                      <p className="text-gray-400 text-xs">{new Date(cmt.created_at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-sm">No comments yet.</p>
                )}
              </div>

              {/* View All Comments Button */}
              <button onClick={async () => { console.log("Fetching comments..."); await fetchComments(); }} className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">View All Comments</button>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-4 flex justify-between w-full">
              {currentIndex > 0 && <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={() => handlePrevUserStory(selectedUser)}>Previous</button>}
              {currentIndex < user.stories.length - 1 && <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={() => handleNextUserStory(selectedUser, user.stories.length)}>Next</button>}
            </div>
          </div>
        );
      })()}
    </div>
  </div>
)}


    </div>



      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-3">
              <input type="text" name="first_name" value={editedProfile.first_name || ""} onChange={handleChange} className="border p-2 w-full rounded" placeholder="First Name" />
              <input type="text" name="last_name" value={editedProfile.last_name || ""} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Last Name" />
              <input type="email" name="email" value={editedProfile.email || ""} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Email" />
              <input type="text" name="phone_number" value={editedProfile.phone_number || ""} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Phone Number" />
              <input type="text" name="address" value={editedProfile.address || ""} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Address" />
              <textarea name="bio" value={editedProfile.bio || ""} onChange={handleChange} className="border p-2 w-full rounded h-20" placeholder="Write your bio..." />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default Profile;

import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
<svg
  width="40"
  height="40"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="fill-current"
>
  <rect x="4" y="10" width="16" height="10" stroke="currentColor" strokeWidth="2" />
  <rect x="7" y="5" width="10" height="5" stroke="currentColor" strokeWidth="2" />
  <rect x="6" y="12" width="2" height="2" fill="currentColor" />
  <rect x="10" y="12" width="2" height="2" fill="currentColor" />
  <rect x="14" y="12" width="2" height="2" fill="currentColor" />
  <rect x="6" y="15" width="2" height="2" fill="currentColor" />
  <rect x="10" y="15" width="2" height="2" fill="currentColor" />
  <rect x="14" y="15" width="2" height="2" fill="currentColor" />
  <rect x="11" y="17" width="2" height="3" fill="currentColor" />
</svg>
    ),
      title: "Hotel Booking",
      paragraph:
        "Traveling to a new country? Finding the right hotel can be tricky, but we've got you covered! Discover the best accommodations, compare prices, and book hassle-free – all in one place.",
    }, 
  {
    id: 1,
    icon: (
      <svg
  width="40"
  height="40"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="fill-current"
>
  <path
    d="M3 3H5L7 17H19L21 7H6"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <circle cx="9" cy="21" r="2" stroke="currentColor" strokeWidth="2" />
  <circle cx="17" cy="21" r="2" stroke="currentColor" strokeWidth="2" />
</svg>

    ),
    
      "title": "Shop Local Treasures",
      "paragraph": "Discover unique local products and souvenirs while traveling.explore traditional markets, and bring home authentic pieces from your journey. Enjoy a hassle-free shopping experience while immersing yourself in the culture of your destination."
    },
    
  {
    id: 1,
    icon: (
<svg
  width="40"
  height="40"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="fill-current"
>
  <path
    d="M12 2L15 8H9L12 2Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M4 22L12 8L20 22H4Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M7 18H17"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <circle cx="12" cy="2" r="1" fill="currentColor" />
</svg>



    ),
    "title": "Unforgettable Party Experiences",
  "paragraph": "Celebrate your travels with vibrant parties! Whether it's a Hurda party, beach gathering, or rooftop celebration, find the best venues and experiences to make your trip even more memorable. Enjoy local entertainment, food, and music while connecting with fellow travelers." },
  {
    id: 1,
    icon: (
      <svg
  width="40"
  height="40"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="fill-current"
>
  <rect
    x="6"
    y="2"
    width="12"
    height="20"
    rx="2"
    stroke="currentColor"
    strokeWidth="2"
  />
  <circle
    cx="12"
    cy="18"
    r="1"
    fill="currentColor"
  />
</svg>


    ),
   
  "title": "Share Your Travel Moments",
  "paragraph": "Capture and share your best travel experiences with the world! Upload stunning photos, showcase your adventures, and inspire fellow travelers. Connect with a community of explorers and relive your favorite trips through shared memories."


  },
  {
    id: 1,
    icon: (
      <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-current"
    >
      
      <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="2" />
      
      
      <path
        d="M8 22V18C8 16.3431 9.34315 15 11 15H13C14.6569 15 16 16.3431 16 18V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
       
      <path
        d="M6 22V17C6 14.7909 7.79086 13 10 13H14C16.2091 13 18 14.7909 18 17V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    
    ),
    
      "title": "Book a Local Guide",
      "paragraph": "Explore historical and cultural landmarks with expert insights! Book a local guide to uncover hidden stories, traditions, and fascinating facts about your destination. Enhance your journey with in-depth knowledge and a personalized experience."
    
    
  },
  {
    id: 1,
    icon: (
      <svg
  width="40"
  height="40"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="fill-current"
>
   
  <path
    d="M3 5L9 3L15 5L21 3V17L15 19L9 17L3 19V5Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  
 
  <path
    d="M9 3V17"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M15 5V19"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
</svg>

    ),
    
      "title": "Interactive Travel Map",
      "paragraph": "Navigate effortlessly with our online travel map! Get real-time directions, explore nearby attractions, and follow guided routes to historical and cultural landmarks. Plan your journey with ease and never miss a must-visit spot."   
  },
];
export default featuresData;

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

// Firebase configuration - using actual project config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "YOUR_FIREBASE_APP_ID",
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    "YOUR_FIREBASE_MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Comprehensive sample destinations data with relevant images
const sampleDestinations = [
  {
    name: "Swat Valley Adventure",
    location: "Swat Valley, KPK",
    category: "Adventure",
    price: 45000,
    rating: 4.8,
    duration: 5,
    departureDate: "2024-03-15",
    endingDate: "2024-03-20",
    startingPoint: "Islamabad",
    description:
      "Experience the breathtaking beauty of Swat Valley with our comprehensive adventure package. From lush green valleys to snow-capped peaks, this journey offers the perfect blend of nature and adventure.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Malam Jabba Ski Resort",
        time: "Day 1 - 9:00 AM",
        description: "Arrive at Malam Jabba and enjoy skiing activities",
        price: 8000,
        type: "tourist_spot",
      },
      {
        place: "Swat Museum",
        time: "Day 2 - 10:00 AM",
        description: "Explore the rich history and culture of Swat",
        price: 2000,
        type: "tourist_spot",
      },
      {
        place: "Kalam Valley Trek",
        time: "Day 3 - 8:00 AM",
        description: "Trek through the beautiful Kalam Valley",
        price: 5000,
        type: "trek",
      },
      {
        place: "Local Restaurant",
        time: "Day 4 - 7:00 PM",
        description: "Enjoy traditional Swati cuisine",
        price: 3000,
        type: "food",
      },
      {
        place: "Mahodand Lake",
        time: "Day 5 - 9:00 AM",
        description: "Visit the stunning Mahodand Lake",
        price: 4000,
        type: "tourist_spot",
      },
    ],
  },
  {
    name: "Hunza Valley Discovery",
    location: "Hunza Valley, Gilgit-Baltistan",
    category: "Cultural",
    price: 65000,
    rating: 4.9,
    duration: 7,
    departureDate: "2024-04-10",
    endingDate: "2024-04-17",
    startingPoint: "Islamabad",
    description:
      "Discover the ancient culture and stunning landscapes of Hunza Valley. This cultural journey takes you through centuries-old traditions and some of the most beautiful scenery in Pakistan.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Baltit Fort",
        time: "Day 1 - 11:00 AM",
        description: "Visit the historic Baltit Fort",
        price: 3000,
        type: "tourist_spot",
      },
      {
        place: "Altit Fort",
        time: "Day 2 - 10:00 AM",
        description: "Explore the ancient Altit Fort",
        price: 2500,
        type: "tourist_spot",
      },
      {
        place: "Passu Cones",
        time: "Day 3 - 9:00 AM",
        description: "Hike to the famous Passu Cones",
        price: 4000,
        type: "trek",
      },
      {
        place: "Local Homestay",
        time: "Day 4 - 6:00 PM",
        description: "Stay with a local family",
        price: 5000,
        type: "hotel",
      },
      {
        place: "Attabad Lake",
        time: "Day 5 - 10:00 AM",
        description: "Boat ride on Attabad Lake",
        price: 3500,
        type: "tourist_spot",
      },
      {
        place: "Khunjerab Pass",
        time: "Day 6 - 8:00 AM",
        description: "Visit the highest border crossing",
        price: 6000,
        type: "tourist_spot",
      },
      {
        place: "Local Market",
        time: "Day 7 - 2:00 PM",
        description: "Shop for local handicrafts",
        price: 2000,
        type: "shopping",
      },
    ],
  },
  {
    name: "Skardu Mountain Expedition",
    location: "Skardu, Gilgit-Baltistan",
    category: "Adventure",
    price: 85000,
    rating: 4.7,
    duration: 8,
    departureDate: "2024-05-20",
    endingDate: "2024-05-28",
    startingPoint: "Islamabad",
    description:
      "Embark on an epic mountain expedition in Skardu. This adventure package includes trekking, climbing, and exploring some of the most challenging and beautiful terrains in Pakistan.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "K2 Base Camp Trek",
        time: "Day 1-3 - 7:00 AM",
        description: "Trek to K2 Base Camp",
        price: 15000,
        type: "trek",
      },
      {
        place: "Concordia",
        time: "Day 4 - 9:00 AM",
        description: "Visit the Throne Room of Mountain Gods",
        price: 8000,
        type: "tourist_spot",
      },
      {
        place: "Baltoro Glacier",
        time: "Day 5 - 8:00 AM",
        description: "Cross the mighty Baltoro Glacier",
        price: 12000,
        type: "trek",
      },
      {
        place: "Mountain Camp",
        time: "Day 6 - 6:00 PM",
        description: "Camp at high altitude",
        price: 7000,
        type: "hotel",
      },
      {
        place: "Deosai Plains",
        time: "Day 7 - 10:00 AM",
        description: "Explore the Deosai Plains",
        price: 6000,
        type: "tourist_spot",
      },
      {
        place: "Satpara Lake",
        time: "Day 8 - 11:00 AM",
        description: "Visit the beautiful Satpara Lake",
        price: 3000,
        type: "tourist_spot",
      },
    ],
  },
  {
    name: "Lahore Heritage Tour",
    location: "Lahore, Punjab",
    category: "Cultural",
    price: 35000,
    rating: 4.6,
    duration: 4,
    departureDate: "2024-06-10",
    endingDate: "2024-06-14",
    startingPoint: "Lahore",
    description:
      "Explore the rich cultural heritage of Lahore, the heart of Pakistan. Visit historical monuments, enjoy traditional food, and experience the vibrant culture of this ancient city.",
    image:
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Badshahi Mosque",
        time: "Day 1 - 9:00 AM",
        description: "Visit the magnificent Badshahi Mosque",
        price: 2000,
        type: "tourist_spot",
      },
      {
        place: "Lahore Fort",
        time: "Day 1 - 2:00 PM",
        description: "Explore the historic Lahore Fort",
        price: 3000,
        type: "tourist_spot",
      },
      {
        place: "Food Street",
        time: "Day 2 - 7:00 PM",
        description: "Experience traditional Lahori cuisine",
        price: 4000,
        type: "food",
      },
      {
        place: "Shalimar Gardens",
        time: "Day 3 - 10:00 AM",
        description: "Visit the beautiful Shalimar Gardens",
        price: 1500,
        type: "tourist_spot",
      },
      {
        place: "Wagah Border",
        time: "Day 4 - 4:00 PM",
        description: "Witness the flag lowering ceremony",
        price: 2500,
        type: "tourist_spot",
      },
    ],
  },
  {
    name: "Karachi Coastal Experience",
    location: "Karachi, Sindh",
    category: "Beach",
    price: 28000,
    rating: 4.4,
    duration: 3,
    departureDate: "2024-07-15",
    endingDate: "2024-07-18",
    startingPoint: "Karachi",
    description:
      "Enjoy the coastal beauty of Karachi with beach activities, seafood, and city exploration. Experience the vibrant culture of Pakistan's largest city.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Clifton Beach",
        time: "Day 1 - 5:00 PM",
        description: "Relax at Clifton Beach",
        price: 1000,
        type: "tourist_spot",
      },
      {
        place: "Port Grand",
        time: "Day 2 - 7:00 PM",
        description: "Enjoy dinner at Port Grand",
        price: 3000,
        type: "food",
      },
      {
        place: "Mazar-e-Quaid",
        time: "Day 3 - 10:00 AM",
        description: "Visit the founder's mausoleum",
        price: 500,
        type: "tourist_spot",
      },
      {
        place: "Dolphin Show",
        time: "Day 3 - 3:00 PM",
        description: "Watch dolphins at the aquarium",
        price: 2000,
        type: "tourist_spot",
      },
    ],
  },
  {
    name: "Murree Hill Station",
    location: "Murree, Punjab",
    category: "Hill Station",
    price: 32000,
    rating: 4.5,
    duration: 4,
    departureDate: "2024-08-20",
    endingDate: "2024-08-24",
    startingPoint: "Islamabad",
    description:
      "Escape to the cool hills of Murree, Pakistan's most popular hill station. Enjoy scenic views, pleasant weather, and peaceful mountain retreat.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Mall Road",
        time: "Day 1 - 3:00 PM",
        description: "Walk along the famous Mall Road",
        price: 500,
        type: "tourist_spot",
      },
      {
        place: "Pindi Point",
        time: "Day 2 - 9:00 AM",
        description: "Enjoy panoramic views",
        price: 1000,
        type: "tourist_spot",
      },
      {
        place: "Kashmir Point",
        time: "Day 3 - 10:00 AM",
        description: "Visit Kashmir Point for views",
        price: 1000,
        type: "tourist_spot",
      },
      {
        place: "Local Restaurant",
        time: "Day 4 - 7:00 PM",
        description: "Try local hill station cuisine",
        price: 2000,
        type: "food",
      },
    ],
  },
  {
    name: "Naran Kaghan Valley",
    location: "Naran, KPK",
    category: "Adventure",
    price: 55000,
    rating: 4.8,
    duration: 6,
    departureDate: "2024-09-10",
    endingDate: "2024-09-16",
    startingPoint: "Islamabad",
    description:
      "Explore the stunning Naran Kaghan Valley with its crystal-clear lakes, lush meadows, and snow-capped peaks. Perfect for adventure seekers and nature lovers.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Saif-ul-Malook Lake",
        time: "Day 1 - 11:00 AM",
        description: "Visit the magical Saif-ul-Malook Lake",
        price: 5000,
        type: "tourist_spot",
      },
      {
        place: "Lulusar Lake",
        time: "Day 2 - 9:00 AM",
        description: "Explore Lulusar Lake",
        price: 4000,
        type: "tourist_spot",
      },
      {
        place: "Babusar Pass",
        time: "Day 3 - 8:00 AM",
        description: "Cross the scenic Babusar Pass",
        price: 6000,
        type: "tourist_spot",
      },
      {
        place: "Hiking Trail",
        time: "Day 4 - 7:00 AM",
        description: "Hike through beautiful trails",
        price: 3000,
        type: "trek",
      },
      {
        place: "Local Camping",
        time: "Day 5 - 6:00 PM",
        description: "Camp under the stars",
        price: 4000,
        type: "hotel",
      },
      {
        place: "Waterfall Visit",
        time: "Day 6 - 10:00 AM",
        description: "Visit local waterfalls",
        price: 2000,
        type: "tourist_spot",
      },
    ],
  },
  {
    name: "Multan Sufi Heritage",
    location: "Multan, Punjab",
    category: "Cultural",
    price: 25000,
    rating: 4.3,
    duration: 3,
    departureDate: "2024-10-05",
    endingDate: "2024-10-08",
    startingPoint: "Multan",
    description:
      "Discover the spiritual heritage of Multan, the City of Saints. Visit ancient shrines, explore traditional bazaars, and experience the mystical atmosphere.",
    image:
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Shah Rukn-e-Alam",
        time: "Day 1 - 9:00 AM",
        description: "Visit the famous shrine",
        price: 1000,
        type: "tourist_spot",
      },
      {
        place: "Ghanta Ghar",
        time: "Day 2 - 10:00 AM",
        description: "Explore the clock tower area",
        price: 500,
        type: "tourist_spot",
      },
      {
        place: "Traditional Bazaar",
        time: "Day 2 - 3:00 PM",
        description: "Shop for traditional crafts",
        price: 2000,
        type: "shopping",
      },
      {
        place: "Local Restaurant",
        time: "Day 3 - 7:00 PM",
        description: "Try Multani cuisine",
        price: 1500,
        type: "food",
      },
    ],
  },
  {
    name: "Chitral Valley Expedition",
    location: "Chitral, KPK",
    category: "Adventure",
    price: 75000,
    rating: 4.9,
    duration: 7,
    departureDate: "2024-11-15",
    endingDate: "2024-11-22",
    startingPoint: "Islamabad",
    description:
      "Embark on an expedition to the remote and beautiful Chitral Valley. Experience unique culture, stunning landscapes, and adventure activities.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Chitral Fort",
        time: "Day 1 - 11:00 AM",
        description: "Visit the historic Chitral Fort",
        price: 3000,
        type: "tourist_spot",
      },
      {
        place: "Kalash Valley",
        time: "Day 2-3 - 9:00 AM",
        description: "Explore the unique Kalash culture",
        price: 8000,
        type: "tourist_spot",
      },
      {
        place: "Tirich Mir View",
        time: "Day 4 - 8:00 AM",
        description: "View the highest peak in Hindukush",
        price: 5000,
        type: "tourist_spot",
      },
      {
        place: "River Rafting",
        time: "Day 5 - 10:00 AM",
        description: "Experience river rafting",
        price: 12000,
        type: "tourist_spot",
      },
      {
        place: "Local Homestay",
        time: "Day 6 - 6:00 PM",
        description: "Stay with local families",
        price: 6000,
        type: "hotel",
      },
      {
        place: "Traditional Music",
        time: "Day 7 - 7:00 PM",
        description: "Enjoy traditional Chitrali music",
        price: 2000,
        type: "tourist_spot",
      },
    ],
  },
  {
    name: "Islamabad City Tour",
    location: "Islamabad, Capital Territory",
    category: "City",
    price: 18000,
    rating: 4.2,
    duration: 2,
    departureDate: "2024-12-01",
    endingDate: "2024-12-03",
    startingPoint: "Islamabad",
    description:
      "Explore Pakistan's beautiful capital city. Visit modern architecture, beautiful parks, and experience the planned city's charm.",
    image:
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    itinerary: [
      {
        place: "Faisal Mosque",
        time: "Day 1 - 9:00 AM",
        description: "Visit the iconic Faisal Mosque",
        price: 1000,
        type: "tourist_spot",
      },
      {
        place: "Daman-e-Koh",
        time: "Day 1 - 4:00 PM",
        description: "Enjoy city views from Daman-e-Koh",
        price: 500,
        type: "tourist_spot",
      },
      {
        place: "Centaurus Mall",
        time: "Day 2 - 11:00 AM",
        description: "Shop at Centaurus Mall",
        price: 2000,
        type: "shopping",
      },
      {
        place: "Lok Virsa Museum",
        time: "Day 2 - 3:00 PM",
        description: "Explore cultural heritage",
        price: 800,
        type: "tourist_spot",
      },
    ],
  },
];

async function populateSampleData() {
  try {
    console.log("Starting to populate sample destinations...");

    for (const destination of sampleDestinations) {
      const docRef = await addDoc(collection(db, "destinations"), {
        ...destination,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(
        `Added destination: ${destination.name} with ID: ${docRef.id}`
      );
    }

    console.log("✅ Successfully populated sample destinations!");
    console.log(
      `Added ${sampleDestinations.length} destinations to Firestore.`
    );
  } catch (error) {
    console.error("❌ Error populating sample data:", error);
  }
}

// Run the script
populateSampleData();

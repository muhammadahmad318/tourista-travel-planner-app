// Simple migration script to populate Firestore with local data
// Run this in your app once to migrate destinations.json to Firestore

import { migrateDestinationsToFirestore } from "../utils/firestoreUtils";

// Import your local data
const localDestinations = [
  {
    id: "21",
    name: "Hunza Valley Adventure",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Explore the breathtaking Hunza Valley, its forts, lakes, and local culture in the heart of Gilgit-Baltistan.",
    rating: 4.9,
    price: "35000",
    duration: "5",
    location: "Gilgit-Baltistan, Pakistan",
    category: "Mountains",
    startingPoint: "Islamabad",
    latitude: 36.3167,
    longitude: 74.65,
    departureDate: "2024-07-10",
    endingDate: "2024-07-15",
    itinerary: [
      {
        time: "Day 1, 7:00 AM",
        place: "Islamabad Departure",
        description:
          "Departure from Islamabad to Chilas via Karakoram Highway.",
        photo:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "2000 PKR",
        type: "transport",
      },
    ],
  },
  {
    id: "22",
    name: "Fairy Meadows Trek",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Trek to the magical Fairy Meadows with stunning views of Nanga Parbat.",
    rating: 4.8,
    price: "25000",
    duration: "4",
    location: "Diamer, Gilgit-Baltistan, Pakistan",
    category: "Mountains",
    startingPoint: "Islamabad",
    latitude: 35.3967,
    longitude: 74.6086,
    departureDate: "2024-07-10",
    endingDate: "2024-07-15",
    itinerary: [
      {
        time: "Day 1, 6:00 AM",
        place: "Islamabad Departure",
        description: "Travel from Islamabad to Chilas via private transport.",
        photo:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "2000 PKR",
        type: "transport",
      },
    ],
  },
  {
    id: "23",
    name: "Lahore Heritage Tour",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Discover the rich history and culture of Lahore, visiting its iconic forts, mosques, and food streets.",
    rating: 4.7,
    price: "12000",
    duration: "2",
    location: "Lahore, Punjab, Pakistan",
    category: "Cities",
    startingPoint: "Lahore",
    latitude: 31.5497,
    longitude: 74.3436,
    departureDate: "2024-07-10",
    endingDate: "2024-07-15",
    itinerary: [
      {
        time: "Day 1, 9:00 AM",
        place: "Lahore Fort",
        description: "Guided tour of the historic Lahore Fort.",
        photo:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "500 PKR",
        type: "tourist_spot",
      },
    ],
  },
];

/**
 * Migration function
 * Call this function once to populate your Firestore database
 */
export const runMigration = async () => {
  try {
    console.log("🚀 Starting Firestore migration...");
    console.log(`📊 Found ${localDestinations.length} destinations to migrate`);

    await migrateDestinationsToFirestore(localDestinations);

    console.log("✅ Migration completed successfully!");
    console.log("🎉 Your destinations are now available in Firestore");

    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Usage example:
// import { runMigration } from './scripts/migrateData';
//
// // Run this once in your app
// runMigration()
//   .then(() => console.log('Migration successful'))
//   .catch(error => console.error('Migration failed:', error));

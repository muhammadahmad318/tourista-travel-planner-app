const {
  migrateDestinationsToFirestore,
} = require("../utils/firestoreUtils.cjs");

// Enhanced sample destinations data for Tourista app
const sampleDestinations = [
  {
    id: "1",
    name: "Hunza Valley Adventure",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Explore the breathtaking Hunza Valley, its ancient forts, crystal-clear lakes, and rich local culture in the heart of Gilgit-Baltistan. Experience the majestic Karakoram mountains and warm hospitality of the local people.",
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
          "Departure from Islamabad to Chilas via Karakoram Highway with scenic views.",
        photo:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "2000 PKR",
        type: "transport",
      },
      {
        time: "Day 2, 9:00 AM",
        place: "Baltit Fort",
        description:
          "Guided tour of the historic Baltit Fort with panoramic views of Hunza Valley.",
        photo:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "1000 PKR",
        type: "tourist_spot",
      },
    ],
  },
  {
    id: "2",
    name: "Fairy Meadows Trek",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Trek to the magical Fairy Meadows with stunning views of Nanga Parbat, the world's ninth-highest mountain. Experience pristine alpine meadows and breathtaking sunrises.",
    rating: 4.8,
    price: "25000",
    duration: "4",
    location: "Diamer, Gilgit-Baltistan, Pakistan",
    category: "Mountains",
    startingPoint: "Islamabad",
    latitude: 35.3967,
    longitude: 74.6086,
    departureDate: "2024-07-15",
    endingDate: "2024-07-19",
    itinerary: [
      {
        time: "Day 1, 6:00 AM",
        place: "Islamabad Departure",
        description:
          "Travel from Islamabad to Chilas via private transport with mountain views.",
        photo:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "2000 PKR",
        type: "transport",
      },
      {
        time: "Day 2, 10:00 AM",
        place: "Fairy Meadows",
        description:
          "Trek to Fairy Meadows with panoramic views of Nanga Parbat.",
        photo:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "0 PKR",
        type: "trek",
      },
    ],
  },
  {
    id: "3",
    name: "Lahore Heritage Tour",
    image:
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Discover the rich history and culture of Lahore, visiting its iconic forts, mosques, and vibrant food streets. Experience the heart of Pakistan's cultural heritage.",
    rating: 4.7,
    price: "12000",
    duration: "2",
    location: "Lahore, Punjab, Pakistan",
    category: "Cities",
    startingPoint: "Lahore",
    latitude: 31.5497,
    longitude: 74.3436,
    departureDate: "2024-07-20",
    endingDate: "2024-07-22",
    itinerary: [
      {
        time: "Day 1, 9:00 AM",
        place: "Lahore Fort",
        description:
          "Guided tour of the historic Lahore Fort with detailed history.",
        photo:
          "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "500 PKR",
        type: "tourist_spot",
      },
      {
        time: "Day 1, 1:00 PM",
        place: "Food Street",
        description:
          "Lunch at the famous Lahore Food Street with local delicacies.",
        photo:
          "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "1000 PKR",
        type: "food",
      },
    ],
  },
  {
    id: "4",
    name: "Karachi Coastal Adventure",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Experience the vibrant city of Karachi with its beautiful beaches, historic sites, and delicious seafood. Visit Clifton Beach, Mohatta Palace, and enjoy the coastal breeze.",
    rating: 4.6,
    price: "18000",
    duration: "3",
    location: "Karachi, Sindh, Pakistan",
    category: "Beaches",
    startingPoint: "Karachi",
    latitude: 24.8607,
    longitude: 67.0011,
    departureDate: "2024-08-01",
    endingDate: "2024-08-04",
    itinerary: [
      {
        time: "Day 1, 10:00 AM",
        place: "Clifton Beach",
        description: "Visit Clifton Beach for swimming and beach activities.",
        photo:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "0 PKR",
        type: "tourist_spot",
      },
      {
        time: "Day 2, 2:00 PM",
        place: "Mohatta Palace",
        description:
          "Explore the historic Mohatta Palace and its beautiful architecture.",
        photo:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "300 PKR",
        type: "tourist_spot",
      },
    ],
  },
  {
    id: "5",
    name: "Swat Valley Paradise",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Discover the Switzerland of Pakistan in Swat Valley. Visit Malam Jabba ski resort, explore ancient Buddhist sites, and enjoy the pristine natural beauty.",
    rating: 4.8,
    price: "28000",
    duration: "4",
    location: "Swat Valley, Khyber Pakhtunkhwa, Pakistan",
    category: "Mountains",
    startingPoint: "Islamabad",
    latitude: 35.2033,
    longitude: 72.5456,
    departureDate: "2024-08-10",
    endingDate: "2024-08-14",
    itinerary: [
      {
        time: "Day 1, 8:00 AM",
        place: "Islamabad to Swat",
        description:
          "Travel from Islamabad to Swat Valley with scenic mountain views.",
        photo:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "2500 PKR",
        type: "transport",
      },
      {
        time: "Day 2, 9:00 AM",
        place: "Malam Jabba",
        description:
          "Visit Malam Jabba ski resort and enjoy mountain activities.",
        photo:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "1500 PKR",
        type: "tourist_spot",
      },
    ],
  },
  {
    id: "6",
    name: "Islamabad City Explorer",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Explore Pakistan's beautiful capital city. Visit Faisal Mosque, Daman-e-Koh viewpoint, and enjoy the modern cityscape with Margalla Hills backdrop.",
    rating: 4.5,
    price: "8000",
    duration: "1",
    location: "Islamabad, Pakistan",
    category: "Cities",
    startingPoint: "Islamabad",
    latitude: 33.6844,
    longitude: 73.0479,
    departureDate: "2024-08-15",
    endingDate: "2024-08-16",
    itinerary: [
      {
        time: "Day 1, 9:00 AM",
        place: "Faisal Mosque",
        description:
          "Visit the iconic Faisal Mosque, the largest mosque in Pakistan.",
        photo:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "0 PKR",
        type: "tourist_spot",
      },
      {
        time: "Day 1, 3:00 PM",
        place: "Daman-e-Koh",
        description: "Visit Daman-e-Koh for panoramic views of Islamabad.",
        photo:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "0 PKR",
        type: "tourist_spot",
      },
    ],
  },
  {
    id: "7",
    name: "Chitral Valley Discovery",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Explore the remote and beautiful Chitral Valley. Visit Kalash Valley, experience unique culture, and enjoy the stunning mountain landscapes.",
    rating: 4.9,
    price: "45000",
    duration: "6",
    location: "Chitral, Khyber Pakhtunkhwa, Pakistan",
    category: "Mountains",
    startingPoint: "Islamabad",
    latitude: 35.8519,
    longitude: 71.7864,
    departureDate: "2024-08-20",
    endingDate: "2024-08-26",
    itinerary: [
      {
        time: "Day 1, 6:00 AM",
        place: "Islamabad to Chitral",
        description:
          "Travel from Islamabad to Chitral via scenic mountain roads.",
        photo:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "3000 PKR",
        type: "transport",
      },
      {
        time: "Day 3, 10:00 AM",
        place: "Kalash Valley",
        description:
          "Visit the unique Kalash Valley and experience their culture.",
        photo:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "2000 PKR",
        type: "tourist_spot",
      },
    ],
  },
  {
    id: "8",
    name: "Multan Historical Tour",
    image:
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Discover the ancient city of Multan, known as the City of Saints. Visit historic shrines, explore the old bazaars, and experience the rich Sufi culture.",
    rating: 4.4,
    price: "15000",
    duration: "2",
    location: "Multan, Punjab, Pakistan",
    category: "Historical Sites",
    startingPoint: "Multan",
    latitude: 30.1575,
    longitude: 71.5249,
    departureDate: "2024-09-01",
    endingDate: "2024-09-03",
    itinerary: [
      {
        time: "Day 1, 9:00 AM",
        place: "Shah Rukn-e-Alam Shrine",
        description:
          "Visit the historic Shah Rukn-e-Alam shrine and learn about Sufi culture.",
        photo:
          "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "0 PKR",
        type: "tourist_spot",
      },
      {
        time: "Day 2, 2:00 PM",
        place: "Multan Bazaar",
        description:
          "Explore the traditional bazaars and shop for local crafts.",
        photo:
          "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "0 PKR",
        type: "tourist_spot",
      },
    ],
  },
];

/**
 * Populate Firestore with sample destinations data
 * Run this function once to populate your Firestore database
 */
async function populateFirestore() {
  try {
    console.log("🚀 Starting Firestore population...");
    console.log(`📊 Found ${sampleDestinations.length} destinations to add`);

    await migrateDestinationsToFirestore(sampleDestinations);

    console.log("✅ Firestore population completed successfully!");
    console.log("🎉 Your destinations are now available in Firestore");
    console.log("📍 You can now view them in your Firebase Console");

    return true;
  } catch (error) {
    console.error("❌ Firestore population failed:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  populateFirestore()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { populateFirestore, sampleDestinations };

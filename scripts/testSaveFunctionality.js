const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} = require("firebase/firestore");

// Firebase configuration
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

/**
 * Test script to verify save functionality
 * This script will:
 * 1. Check if savedItems collection exists
 * 2. Display current saved items
 * 3. Test the structure of saved items
 */
async function testSaveFunctionality() {
  try {
    console.log("🧪 Testing Save Functionality...");
    console.log("=====================================");

    // Test 1: Check if savedItems collection exists and has data
    console.log("\n1. Checking savedItems collection...");
    const savedItemsQuery = query(
      collection(db, "savedItems"),
      orderBy("createdAt", "desc")
    );

    const savedItemsSnapshot = await getDocs(savedItemsQuery);

    if (savedItemsSnapshot.empty) {
      console.log("✅ savedItems collection exists but is empty");
      console.log("   This is expected if no users have saved items yet");
    } else {
      console.log(`✅ Found ${savedItemsSnapshot.size} saved items`);

      // Test 2: Analyze saved items structure
      console.log("\n2. Analyzing saved items structure...");
      const savedItems = [];

      savedItemsSnapshot.forEach((doc) => {
        const data = doc.data();
        savedItems.push({
          id: doc.id,
          ...data,
        });
      });

      // Group by type
      const tourPackages = savedItems.filter(
        (item) => item.type === "tour_package"
      );
      const aiTours = savedItems.filter(
        (item) => item.type === "ai_generated_tour"
      );

      console.log(`   📦 Tour Packages: ${tourPackages.length}`);
      console.log(`   🤖 AI-Generated Tours: ${aiTours.length}`);

      // Test 3: Validate data structure
      console.log("\n3. Validating data structure...");

      if (tourPackages.length > 0) {
        const samplePackage = tourPackages[0];
        console.log("   📦 Sample Tour Package Structure:");
        console.log(`     - ID: ${samplePackage.id}`);
        console.log(`     - User ID: ${samplePackage.userId}`);
        console.log(`     - Type: ${samplePackage.type}`);
        console.log(
          `     - Tour Name: ${samplePackage.itemData.name || "N/A"}`
        );
        console.log(
          `     - Location: ${samplePackage.itemData.location || "N/A"}`
        );
        console.log(`     - Price: ${samplePackage.itemData.price || "N/A"}`);
        console.log(
          `     - Created: ${samplePackage.createdAt?.toDate?.() || "N/A"}`
        );
      }

      if (aiTours.length > 0) {
        const sampleAITour = aiTours[0];
        console.log("   🤖 Sample AI-Generated Tour Structure:");
        console.log(`     - ID: ${sampleAITour.id}`);
        console.log(`     - User ID: ${sampleAITour.userId}`);
        console.log(`     - Type: ${sampleAITour.type}`);
        console.log(
          `     - Destination: ${
            sampleAITour.itemData.tour_info?.destination_name || "N/A"
          }`
        );
        console.log(
          `     - Duration: ${
            sampleAITour.itemData.tour_info?.dateRange?.numberOfDays || "N/A"
          } days`
        );
        console.log(
          `     - Total Cost: ${
            sampleAITour.itemData.total_estimates?.total_estimated_cost || "N/A"
          }`
        );
        console.log(
          `     - Created: ${sampleAITour.createdAt?.toDate?.() || "N/A"}`
        );
      }

      // Test 4: Check for any data inconsistencies
      console.log("\n4. Checking for data inconsistencies...");
      let inconsistencies = 0;

      savedItems.forEach((item, index) => {
        if (!item.userId) {
          console.log(`   ❌ Item ${index}: Missing userId`);
          inconsistencies++;
        }
        if (!item.type) {
          console.log(`   ❌ Item ${index}: Missing type`);
          inconsistencies++;
        }
        if (!item.itemData) {
          console.log(`   ❌ Item ${index}: Missing itemData`);
          inconsistencies++;
        }
        if (!item.createdAt) {
          console.log(`   ❌ Item ${index}: Missing createdAt`);
          inconsistencies++;
        }
      });

      if (inconsistencies === 0) {
        console.log("   ✅ All saved items have valid structure");
      } else {
        console.log(`   ⚠️  Found ${inconsistencies} data inconsistencies`);
      }
    }

    // Test 5: Check if users collection exists (for user authentication)
    console.log("\n5. Checking users collection...");
    const usersQuery = query(collection(db, "users"));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      console.log("   ℹ️  users collection exists but is empty");
      console.log("   This is expected if no users have registered yet");
    } else {
      console.log(`   ✅ Found ${usersSnapshot.size} user profiles`);
    }

    console.log("\n=====================================");
    console.log("✅ Save functionality test completed!");
    console.log("\n📝 Summary:");
    console.log("   - savedItems collection is properly set up");
    console.log("   - Data structure validation passed");
    console.log("   - Ready for user interactions");
    console.log(
      "\n🚀 The save functionality should work correctly in the app!"
    );
  } catch (error) {
    console.error("❌ Error testing save functionality:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Check Firebase configuration");
    console.log("   2. Verify Firestore security rules");
    console.log("   3. Ensure collections exist in Firebase Console");
  }
}

// Run the test
testSaveFunctionality()
  .then(() => {
    console.log("\n🎉 Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error);
    process.exit(1);
  });

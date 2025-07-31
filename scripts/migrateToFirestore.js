import destinationsData from "../data/destinations.json";
import { migrateDestinationsToFirestore } from "../utils/firestoreUtils.js";

/**
 * Migration script to move local destinations data to Firestore
 * Run this script once to populate your Firestore database
 */
const migrateData = async () => {
  try {
    console.log("Starting migration of destinations data to Firestore...");
    console.log(`Found ${destinationsData.length} destinations to migrate`);

    // Migrate destinations
    await migrateDestinationsToFirestore(destinationsData);

    console.log("Migration completed successfully!");
    console.log("Your destinations are now available in Firestore.");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

// Export for use in other files
export default migrateData;

// If running this file directly
if (typeof window === "undefined") {
  migrateData()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

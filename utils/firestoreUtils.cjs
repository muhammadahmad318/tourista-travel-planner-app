const {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} = require("firebase/firestore");
const { db } = require("../firebaseConfig.cjs");

/**
 * Migrate local destinations data to Firestore
 * @param {Array} destinationsData - Array of destination objects
 * @returns {Promise<void>}
 */
async function migrateDestinationsToFirestore(destinationsData) {
  try {
    const batch = writeBatch(db);
    destinationsData.forEach((destination) => {
      const docRef = doc(collection(db, "destinations"));
      batch.set(docRef, {
        ...destination,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
    console.log(
      `Successfully migrated ${destinationsData.length} destinations to Firestore`
    );
  } catch (error) {
    console.error("Error migrating destinations:", error);
    throw error;
  }
}

module.exports = { migrateDestinationsToFirestore };

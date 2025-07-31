import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

let db;

// Use the correct Firebase config depending on environment
if (typeof window === "undefined") {
  // Node.js script
  db = require("../firebaseConfig.cjs").db;
} else {
  // React Native / Expo
  db = require("../firebaseConfig").db;
}

// ==================== DESTINATIONS COLLECTION ====================

/**
 * Get all destinations from Firestore
 * @param {number} limitCount - Number of destinations to fetch (optional)
 * @returns {Promise<Array>} Array of destination documents
 */
export const getAllDestinations = async (limitCount = null) => {
  try {
    let destinationsQuery = collection(db, "destinations");

    if (limitCount) {
      destinationsQuery = query(destinationsQuery, limit(limitCount));
    }

    const querySnapshot = await getDocs(destinationsQuery);
    const destinations = [];

    querySnapshot.forEach((doc) => {
      destinations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return destinations;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw error;
  }
};

/**
 * Get destinations by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Array of filtered destinations
 */
export const getDestinationsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, "destinations"),
      where("category", "==", category)
    );

    const querySnapshot = await getDocs(q);
    const destinations = [];

    querySnapshot.forEach((doc) => {
      destinations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return destinations;
  } catch (error) {
    console.error("Error fetching destinations by category:", error);
    throw error;
  }
};

/**
 * Get a single destination by ID
 * @param {string} destinationId - Destination document ID
 * @returns {Promise<Object>} Destination document
 */
export const getDestinationById = async (destinationId) => {
  try {
    const docRef = doc(db, "destinations", destinationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Destination not found");
    }
  } catch (error) {
    console.error("Error fetching destination:", error);
    throw error;
  }
};

/**
 * Add a new destination to Firestore
 * @param {Object} destinationData - Destination data object
 * @returns {Promise<string>} New document ID
 */
export const addDestination = async (destinationData) => {
  try {
    const docRef = await addDoc(collection(db, "destinations"), {
      ...destinationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding destination:", error);
    throw error;
  }
};

/**
 * Update an existing destination
 * @param {string} destinationId - Destination document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export const updateDestination = async (destinationId, updateData) => {
  try {
    const docRef = doc(db, "destinations", destinationId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    throw error;
  }
};

/**
 * Delete a destination
 * @param {string} destinationId - Destination document ID
 * @returns {Promise<void>}
 */
export const deleteDestination = async (destinationId) => {
  try {
    const docRef = doc(db, "destinations", destinationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting destination:", error);
    throw error;
  }
};

/**
 * Search destinations by name or location
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching destinations
 */
export const searchDestinations = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple contains query - consider using Algolia for better search
    const q = query(
      collection(db, "destinations"),
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const destinations = [];

    querySnapshot.forEach((doc) => {
      destinations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return destinations;
  } catch (error) {
    console.error("Error searching destinations:", error);
    throw error;
  }
};

// ==================== USERS COLLECTION ====================

/**
 * Get user profile by Firebase Auth UID
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Object>} User profile document
 */
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Create or update user profile
 * @param {string} uid - Firebase Auth UID
 * @param {Object} userData - User profile data
 * @returns {Promise<void>}
 */
export const createOrUpdateUserProfile = async (uid, userData) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update existing profile
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new profile
      await setDoc(docRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw error;
  }
};

/**
 * Update user preferences
 * @param {string} uid - Firebase Auth UID
 * @param {Object} preferences - User preferences
 * @returns {Promise<void>}
 */
export const updateUserPreferences = async (uid, preferences) => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      preferences,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

// ==================== TRIPS COLLECTION ====================

/**
 * Get user's trips
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Array>} Array of user's trips
 */
export const getUserTrips = async (uid) => {
  try {
    const q = query(
      collection(db, "trips"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const trips = [];

    querySnapshot.forEach((doc) => {
      trips.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return trips;
  } catch (error) {
    console.error("Error fetching user trips:", error);
    throw error;
  }
};

/**
 * Create a new trip
 * @param {Object} tripData - Trip data including userId
 * @returns {Promise<string>} New trip document ID
 */
export const createTrip = async (tripData) => {
  try {
    const docRef = await addDoc(collection(db, "trips"), {
      ...tripData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

/**
 * Update a trip
 * @param {string} tripId - Trip document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export const updateTrip = async (tripId, updateData) => {
  try {
    const docRef = doc(db, "trips", tripId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

/**
 * Delete a trip
 * @param {string} tripId - Trip document ID
 * @returns {Promise<void>}
 */
export const deleteTrip = async (tripId) => {
  try {
    const docRef = doc(db, "trips", tripId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};

// ==================== FAVORITES COLLECTION ====================

/**
 * Get user's favorite destinations
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Array>} Array of favorite destinations
 */
export const getUserFavorites = async (uid) => {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const favorites = [];

    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return favorites;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

/**
 * Add destination to favorites
 * @param {string} uid - Firebase Auth UID
 * @param {string} destinationId - Destination document ID
 * @returns {Promise<string>} New favorite document ID
 */
export const addToFavorites = async (uid, destinationId) => {
  try {
    const docRef = await addDoc(collection(db, "favorites"), {
      userId: uid,
      destinationId,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

/**
 * Remove destination from favorites
 * @param {string} uid - Firebase Auth UID
 * @param {string} destinationId - Destination document ID
 * @returns {Promise<void>}
 */
export const removeFromFavorites = async (uid, destinationId) => {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", uid),
      where("destinationId", "==", destinationId)
    );

    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

/**
 * Check if destination is in user's favorites
 * @param {string} uid - Firebase Auth UID
 * @param {string} destinationId - Destination document ID
 * @returns {Promise<boolean>} True if favorited
 */
export const isDestinationFavorited = async (uid, destinationId) => {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", uid),
      where("destinationId", "==", destinationId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    throw error;
  }
};

// ==================== REVIEWS COLLECTION ====================

/**
 * Get reviews for a destination
 * @param {string} destinationId - Destination document ID
 * @returns {Promise<Array>} Array of reviews
 */
export const getDestinationReviews = async (destinationId) => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("destinationId", "==", destinationId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reviews = [];

    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

/**
 * Add a review for a destination
 * @param {Object} reviewData - Review data including userId and destinationId
 * @returns {Promise<string>} New review document ID
 */
export const addReview = async (reviewData) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...reviewData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// ==================== REAL-TIME LISTENERS ====================

/**
 * Listen to destinations changes in real-time
 * @param {Function} callback - Callback function to handle data changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToDestinations = (callback) => {
  const q = query(collection(db, "destinations"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const destinations = [];
    querySnapshot.forEach((doc) => {
      destinations.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    callback(destinations);
  });
};

/**
 * Listen to user's trips changes in real-time
 * @param {string} uid - Firebase Auth UID
 * @param {Function} callback - Callback function to handle data changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserTrips = (uid, callback) => {
  const q = query(
    collection(db, "trips"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (querySnapshot) => {
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    callback(trips);
  });
};

// ==================== BATCH OPERATIONS ====================

/**
 * Migrate local destinations data to Firestore
 * @param {Array} destinationsData - Array of destination objects
 * @returns {Promise<void>}
 */
export const migrateDestinationsToFirestore = async (destinationsData) => {
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
};

// ==================== SAVED ITEMS COLLECTION ====================

/**
 * Get user's saved items (both tour packages and AI-generated tours)
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Array>} Array of saved items
 */
export const getUserSavedItems = async (uid) => {
  try {
    // Use a simpler query that doesn't require composite index
    const q = query(collection(db, "savedItems"), where("userId", "==", uid));

    const querySnapshot = await getDocs(q);
    const savedItems = [];

    querySnapshot.forEach((doc) => {
      savedItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by createdAt in descending order on the client side
    savedItems.sort((a, b) => {
      const dateA =
        a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB =
        b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA; // Descending order
    });

    return savedItems;
  } catch (error) {
    console.error("Error fetching saved items:", error);
    throw error;
  }
};

/**
 * Save a tour package to user's saved items
 * @param {string} uid - Firebase Auth UID
 * @param {Object} tourData - Tour package data
 * @returns {Promise<string>} New saved item document ID
 */
export const saveTourPackage = async (uid, tourData) => {
  try {
    const docRef = await addDoc(collection(db, "savedItems"), {
      userId: uid,
      type: "tour_package",
      itemData: tourData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving tour package:", error);
    throw error;
  }
};

/**
 * Save an AI-generated tour to user's saved items
 * @param {string} uid - Firebase Auth UID
 * @param {Object} aiTourData - AI-generated tour data
 * @returns {Promise<string>} New saved item document ID
 */
export const saveAiGeneratedTour = async (uid, aiTourData) => {
  try {
    const docRef = await addDoc(collection(db, "savedItems"), {
      userId: uid,
      type: "ai_generated_tour",
      itemData: aiTourData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving AI-generated tour:", error);
    throw error;
  }
};

/**
 * Remove a saved item
 * @param {string} savedItemId - Saved item document ID
 * @returns {Promise<void>}
 */
export const removeSavedItem = async (savedItemId) => {
  try {
    const docRef = doc(db, "savedItems", savedItemId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error removing saved item:", error);
    throw error;
  }
};

/**
 * Check if a tour package is saved by the user
 * @param {string} uid - Firebase Auth UID
 * @param {string} tourId - Tour package ID
 * @returns {Promise<boolean>} True if saved, false otherwise
 */
export const isTourPackageSaved = async (uid, tourId) => {
  try {
    const q = query(
      collection(db, "savedItems"),
      where("userId", "==", uid),
      where("type", "==", "tour_package"),
      where("itemData.id", "==", tourId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if tour package is saved:", error);
    return false;
  }
};

/**
 * Check if an AI-generated tour is saved by the user
 * @param {string} uid - Firebase Auth UID
 * @param {string} tourId - AI-generated tour ID (can be a hash or timestamp)
 * @returns {Promise<boolean>} True if saved, false otherwise
 */
export const isAiGeneratedTourSaved = async (uid, tourId) => {
  try {
    const q = query(
      collection(db, "savedItems"),
      where("userId", "==", uid),
      where("type", "==", "ai_generated_tour"),
      where("itemData.tour_info.destination_name", "==", tourId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if AI-generated tour is saved:", error);
    return false;
  }
};

/**
 * Listen to user's saved items changes in real-time
 * @param {string} uid - Firebase Auth UID
 * @param {Function} callback - Callback function to handle data changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserSavedItems = (uid, callback) => {
  const q = query(collection(db, "savedItems"), where("userId", "==", uid));

  return onSnapshot(q, (querySnapshot) => {
    const savedItems = [];
    querySnapshot.forEach((doc) => {
      savedItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by createdAt in descending order on the client side
    savedItems.sort((a, b) => {
      const dateA =
        a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB =
        b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA; // Descending order
    });

    callback(savedItems);
  });
};

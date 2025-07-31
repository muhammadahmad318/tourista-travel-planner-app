import { onAuthStateChanged } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import {
  addToFavorites,
  createOrUpdateUserProfile,
  getUserFavorites,
  getUserProfile,
  getUserSavedItems,
  getUserTrips,
  isAiGeneratedTourSaved,
  isDestinationFavorited,
  isTourPackageSaved,
  removeFromFavorites,
  removeSavedItem,
  saveAiGeneratedTour,
  saveTourPackage,
  updateUserPreferences,
} from "../utils/firestoreUtils";

/**
 * Custom hook for managing user data with Firestore
 * Provides user profile management and authentication state
 */
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError(err.message);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update user profile
  const updateProfile = useCallback(
    async (profileData) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        setError(null);
        await createOrUpdateUserProfile(user.uid, profileData);

        // Update local state
        setUserProfile((prev) => ({
          ...prev,
          ...profileData,
        }));
      } catch (err) {
        setError(err.message);
        console.error("Error updating profile:", err);
        throw err;
      }
    },
    [user]
  );

  // Update user preferences
  const updatePreferences = useCallback(
    async (preferences) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        setError(null);
        await updateUserPreferences(user.uid, preferences);

        // Update local state
        setUserProfile((prev) => ({
          ...prev,
          preferences,
        }));
      } catch (err) {
        setError(err.message);
        console.error("Error updating preferences:", err);
        throw err;
      }
    },
    [user]
  );

  return {
    user,
    userProfile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    isAuthenticated: !!user,
  };
};

/**
 * Custom hook for managing user trips
 */
export const useUserTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async (userId) => {
    if (!userId) {
      setTrips([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserTrips(userId);
      setTrips(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching user trips:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trips,
    loading,
    error,
    fetchTrips,
  };
};

/**
 * Custom hook for managing user favorites
 */
export const useUserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async (userId) => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserFavorites(userId);
      setFavorites(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching user favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (userId, destinationId) => {
    try {
      setError(null);
      await addToFavorites(userId, destinationId);

      // Update local state
      setFavorites((prev) => [
        ...prev,
        {
          userId,
          destinationId,
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      setError(err.message);
      console.error("Error adding favorite:", err);
      throw err;
    }
  }, []);

  const removeFavorite = useCallback(async (userId, destinationId) => {
    try {
      setError(null);
      await removeFromFavorites(userId, destinationId);

      // Update local state
      setFavorites((prev) =>
        prev.filter((fav) => fav.destinationId !== destinationId)
      );
    } catch (err) {
      setError(err.message);
      console.error("Error removing favorite:", err);
      throw err;
    }
  }, []);

  const checkIsFavorited = useCallback(async (userId, destinationId) => {
    try {
      const isFavorited = await isDestinationFavorited(userId, destinationId);
      return isFavorited;
    } catch (err) {
      console.error("Error checking favorite status:", err);
      return false;
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    checkIsFavorited,
  };
};

/**
 * Custom hook for managing user saved items
 */
export const useUserSavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedItems = useCallback(async (userId) => {
    if (!userId) {
      setSavedItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserSavedItems(userId);
      setSavedItems(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching saved items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTourPackageItem = useCallback(async (userId, tourData) => {
    try {
      setError(null);
      const savedItemId = await saveTourPackage(userId, tourData);

      // Update local state
      setSavedItems((prev) => [
        {
          id: savedItemId,
          userId,
          type: "tour_package",
          itemData: tourData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...prev,
      ]);

      return savedItemId;
    } catch (err) {
      setError(err.message);
      console.error("Error saving tour package:", err);
      throw err;
    }
  }, []);

  const saveAiGeneratedTourItem = useCallback(async (userId, aiTourData) => {
    try {
      setError(null);
      const savedItemId = await saveAiGeneratedTour(userId, aiTourData);

      // Update local state
      setSavedItems((prev) => [
        {
          id: savedItemId,
          userId,
          type: "ai_generated_tour",
          itemData: aiTourData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...prev,
      ]);

      return savedItemId;
    } catch (err) {
      setError(err.message);
      console.error("Error saving AI-generated tour:", err);
      throw err;
    }
  }, []);

  const removeSavedItemById = useCallback(async (savedItemId) => {
    try {
      setError(null);
      await removeSavedItem(savedItemId);

      // Update local state
      setSavedItems((prev) => prev.filter((item) => item.id !== savedItemId));
    } catch (err) {
      setError(err.message);
      console.error("Error removing saved item:", err);
      throw err;
    }
  }, []);

  const checkIsTourPackageSaved = useCallback(async (userId, tourId) => {
    try {
      const isSaved = await isTourPackageSaved(userId, tourId);
      return isSaved;
    } catch (err) {
      console.error("Error checking if tour package is saved:", err);
      return false;
    }
  }, []);

  const checkIsAiGeneratedTourSaved = useCallback(async (userId, tourId) => {
    try {
      const isSaved = await isAiGeneratedTourSaved(userId, tourId);
      return isSaved;
    } catch (err) {
      console.error("Error checking if AI-generated tour is saved:", err);
      return false;
    }
  }, []);

  return {
    savedItems,
    loading,
    error,
    fetchSavedItems,
    saveTourPackage: saveTourPackageItem,
    saveAiGeneratedTour: saveAiGeneratedTourItem,
    removeSavedItem: removeSavedItemById,
    checkIsTourPackageSaved,
    checkIsAiGeneratedTourSaved,
  };
};

import { useCallback, useEffect, useState } from "react";
import {
  getAllDestinations,
  getDestinationById,
  getDestinationsByCategory,
  searchDestinations,
  subscribeToDestinations,
} from "../utils/firestoreUtils";

/**
 * Custom hook for managing destinations data with Firestore
 * Provides real-time updates and caching
 */
export const useDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all destinations
  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching destinations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch destinations by category
  const fetchDestinationsByCategory = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDestinationsByCategory(category);
      setDestinations(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching destinations by category:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search destinations
  const searchDestinationsData = useCallback(async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchDestinations(searchTerm);
      setDestinations(data);
    } catch (err) {
      setError(err.message);
      console.error("Error searching destinations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single destination
  const getDestination = useCallback(async (destinationId) => {
    try {
      setError(null);
      const data = await getDestinationById(destinationId);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching destination:", err);
      throw err;
    }
  }, []);

  // Set up real-time listener
  useEffect(() => {
    const unsubscribe = subscribeToDestinations((data) => {
      setDestinations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    destinations,
    loading,
    error,
    fetchDestinations,
    fetchDestinationsByCategory,
    searchDestinations: searchDestinationsData,
    getDestination,
    refetch: fetchDestinations,
  };
};

/**
 * Custom hook for managing a single destination
 */
export const useDestination = (destinationId) => {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destinationId) {
      setLoading(false);
      return;
    }

    const fetchDestination = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDestinationById(destinationId);
        setDestination(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [destinationId]);

  return {
    destination,
    loading,
    error,
  };
};

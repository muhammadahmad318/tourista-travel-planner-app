// Utility functions for Google Places API
const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE;

/**
 * Fetch place details including photos using Google Places API
 * @param {string} placeName - Name of the place to search for
 * @param {string} location - Location context (e.g., "Islamabad, Pakistan")
 * @returns {Promise<Object>} Place details with photo URLs
 */
export const fetchPlaceDetails = async (placeName, location = "Pakistan") => {
  try {
    // First, search for the place
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      placeName + ", " + location
    )}&key=${GOOGLE_PLACES_API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      const place = searchData.results[0];
      const placeId = place.place_id;

      // Then, get detailed information including photos
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,photos,place_id,url&key=${GOOGLE_PLACES_API_KEY}`;

      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      if (detailsData.result) {
        const result = detailsData.result;

        // Get photo URL using the reliable old API endpoint
        let photoUrl = null;
        if (result.photos && result.photos.length > 0) {
          photoUrl = getPhotoUrl(result.photos[0].photo_reference);
        }

        return {
          place_id: result.place_id,
          name: result.name,
          formatted_address: result.formatted_address,
          geometry: result.geometry,
          photos: result.photos || [],
          url: result.url,
          photo_url: photoUrl,
          photo_ref:
            result.photos && result.photos.length > 0
              ? result.photos[0].photo_reference
              : null, // Keep for backward compatibility
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};

/**
 * Get photo URL using the reliable Google Places API photo endpoint
 * @param {string} photoReference - Photo reference from Google Places API
 * @param {number} maxWidth - Maximum width of the photo (default: 400)
 * @returns {string} Photo URL
 */
export const getPhotoUrl = (photoReference, maxWidth = 400) => {
  if (!photoReference) return null;

  // Use the reliable old API endpoint that works consistently
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
};

/**
 * Get photo URL using place ID (alternative method for v1 API)
 * @param {string} placeId - Place ID from Google Places API
 * @param {number} maxWidth - Maximum width of the photo (default: 400)
 * @returns {string} Photo URL
 */
export const getPhotoUrlByPlaceId = (placeId, maxWidth = 400) => {
  if (!placeId) return null;

  // Use the new v1 media endpoint with place ID
  return `https://places.googleapis.com/v1/places/${placeId}/media?key=${GOOGLE_PLACES_API_KEY}&maxWidthPx=${maxWidth}`;
};

/**
 * Fetch multiple place details in batch
 * @param {Array} places - Array of place objects with name and location
 * @returns {Promise<Array>} Array of place details
 */
export const fetchMultiplePlaceDetails = async (places) => {
  const results = [];

  for (const place of places) {
    const details = await fetchPlaceDetails(place.name, place.location);
    if (details) {
      results.push({
        ...place,
        ...details,
      });
    }
    // Add a small delay to avoid hitting API rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return results;
};

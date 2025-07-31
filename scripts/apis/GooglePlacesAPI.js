// Google Places API integration for tour planning
const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE;

export class GooglePlacesAPI {
  static async getPlaceDetails(placeId) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,photos,types&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return {
        name: data.result.name,
        address: data.result.formatted_address,
        coordinates: {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        },
        rating: data.result.rating || 0,
        types: data.result.types || [],
      };
    } catch (error) {
      console.error("Error fetching place details:", error);
      throw new Error(`Failed to fetch place details: ${error.message}`);
    }
  }

  static async getNearbyAttractions(coordinates, budgetType) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.latitude},${coordinates.longitude}&radius=5000&type=tourist_attraction&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      if (
        data.status === "ZERO_RESULTS" ||
        !data.results ||
        data.results.length === 0
      ) {
        console.warn("No attractions found for the location");
        return [];
      }

      return data.results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        rating: place.rating || 0,
        type: this.getAttractionType(place.types),
        entry_fee: this.calculateEntryFee(budgetType, place.rating),
        opening_hours: place.opening_hours
          ? place.opening_hours.open_now
            ? "Open"
            : "Closed"
          : "Unknown",
        google_maps_url: `https://maps.google.com/?q=${place.geometry.location.lat},${place.geometry.location.lng}`,
        description: `Visit ${place.name} - a popular tourist attraction in the area.`,
        contact: "Local Tourism Office",
        tips: "Best time to visit is during daylight hours.",
      }));
    } catch (error) {
      console.error("Error fetching nearby attractions:", error);
      throw new Error(`Failed to fetch attractions: ${error.message}`);
    }
  }

  static async getNearbyHotels(coordinates, budgetType, travelType, guests) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.latitude},${coordinates.longitude}&radius=3000&type=lodging&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      if (
        data.status === "ZERO_RESULTS" ||
        !data.results ||
        data.results.length === 0
      ) {
        console.warn("No hotels found for the location");
        return [];
      }

      return data.results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        rating: place.rating || 0,
        price_per_night: this.calculateHotelPrice(
          budgetType,
          travelType,
          place.rating
        ),
        description: `${place.name} - ${
          place.rating ? `${place.rating} star` : "Quality"
        } accommodation in the area.`,
        amenities: this.getDefaultAmenities(budgetType),
        contact: "+92-300-1234567",
        booking_url: "https://booking.com",
        google_maps_url: `https://maps.google.com/?q=${place.geometry.location.lat},${place.geometry.location.lng}`,
      }));
    } catch (error) {
      console.error("Error fetching nearby hotels:", error);
      throw new Error(`Failed to fetch hotels: ${error.message}`);
    }
  }

  static async getNearbyRestaurants(coordinates, budgetType) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.latitude},${coordinates.longitude}&radius=2000&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      if (
        data.status === "ZERO_RESULTS" ||
        !data.results ||
        data.results.length === 0
      ) {
        console.warn("No restaurants found for the location");
        return [];
      }

      // Categorize restaurants by meal type
      const restaurants = data.results.map((place, index) => ({
        name: place.name,
        address: place.vicinity,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        rating: place.rating || 0,
        type: this.getMealType(index),
        average_cost: this.calculateMealCost(budgetType, place.rating),
        cuisine: this.getCuisineType(place.types),
        google_maps_url: `https://maps.google.com/?q=${place.geometry.location.lat},${place.geometry.location.lng}`,
        contact: "+92-300-1234567",
      }));

      return restaurants;
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      throw new Error(`Failed to fetch restaurants: ${error.message}`);
    }
  }

  static async getDistance(origin, destination) {
    try {
      const originCoords = origin.geo_coordinates || origin.coordinates;
      const destCoords = destination.geo_coordinates || destination.coordinates;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.latitude},${originCoords.longitude}&destinations=${destCoords.latitude},${destCoords.longitude}&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(`Google Distance Matrix API error: ${data.status}`);
      }

      if (
        !data.rows ||
        !data.rows[0] ||
        !data.rows[0].elements ||
        !data.rows[0].elements[0]
      ) {
        throw new Error("No distance data available");
      }

      const element = data.rows[0].elements[0];

      if (element.status !== "OK") {
        throw new Error(`Distance calculation failed: ${element.status}`);
      }

      // Convert distance from meters to kilometers
      const distanceInKm = element.distance.value / 1000;
      console.log(`Calculated distance: ${distanceInKm} km`);

      return distanceInKm;
    } catch (error) {
      console.error("Error calculating distance:", error);
      throw new Error(`Failed to calculate distance: ${error.message}`);
    }
  }

  // Helper methods
  static getAttractionType(types) {
    if (types.includes("museum")) return "HistoricalTourSpot";
    if (types.includes("park")) return "HillyTourSpot";
    if (types.includes("amusement_park") || types.includes("aquarium"))
      return "EntertainmentTourSpot";
    return "tourSpot";
  }

  static calculateEntryFee(budgetType, rating) {
    const baseFee =
      budgetType === "luxury" ? 500 : budgetType === "moderate" ? 300 : 100;
    const ratingMultiplier = rating ? rating / 5 : 1;
    return Math.round(baseFee * ratingMultiplier);
  }

  static calculateHotelPrice(budgetType, travelType, rating) {
    const basePrices = {
      luxury: { solo: 8000, couple: 10000, family: 12000 },
      moderate: { solo: 4000, couple: 6000, family: 8000 },
      cheap: { solo: 2000, couple: 3000, family: 4000 },
    };

    const type =
      travelType === "solo"
        ? "solo"
        : travelType === "couple"
        ? "couple"
        : "family";
    const basePrice = basePrices[budgetType][type];
    const ratingMultiplier = rating ? rating / 5 : 1;

    return Math.round(basePrice * ratingMultiplier);
  }

  static getDefaultAmenities(budgetType) {
    const baseAmenities = ["WiFi", "Air Conditioning"];

    if (budgetType === "luxury") {
      return [...baseAmenities, "Restaurant", "Spa", "Swimming Pool", "Gym"];
    } else if (budgetType === "moderate") {
      return [...baseAmenities, "Restaurant", "Parking"];
    } else {
      return baseAmenities;
    }
  }

  static getMealType(index) {
    const mealTypes = ["breakfast", "lunch", "dinner"];
    return mealTypes[index % mealTypes.length];
  }

  static calculateMealCost(budgetType, rating) {
    const baseCost =
      budgetType === "luxury" ? 1500 : budgetType === "moderate" ? 1000 : 600;
    const ratingMultiplier = rating ? rating / 5 : 1;
    return Math.round(baseCost * ratingMultiplier);
  }

  static getCuisineType(types) {
    if (types.includes("indian_restaurant")) return "Indian Cuisine";
    if (types.includes("chinese_restaurant")) return "Chinese Cuisine";
    if (types.includes("italian_restaurant")) return "Italian Cuisine";
    return "Local & International Cuisine";
  }
}

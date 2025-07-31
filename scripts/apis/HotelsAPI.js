// Hotels API integration using Google Places API
import { GooglePlacesAPI } from "./GooglePlacesAPI.js";

export class HotelsAPI {
  static async searchHotels({
    location,
    coordinates,
    checkIn,
    checkOut,
    guests,
    budget,
    travelType,
  }) {
    try {
      console.log("Searching hotels for:", {
        location,
        coordinates,
        budget,
        travelType,
        guests,
      });

      // Use Google Places API to find hotels
      const hotels = await GooglePlacesAPI.getNearbyHotels(
        coordinates,
        budget,
        travelType,
        guests
      );

      if (!hotels || hotels.length === 0) {
        throw new Error(
          "No hotels found for the specified location and criteria"
        );
      }

      console.log(`Found ${hotels.length} hotels for ${location}`);

      return hotels.map((hotel) => ({
        name: hotel.name,
        address: hotel.address,
        coordinates: hotel.coordinates,
        rating: hotel.rating,
        price_per_night: hotel.price_per_night,
        description: hotel.description,
        amenities: hotel.amenities,
        contact: hotel.contact,
        booking_url: hotel.booking_url,
        google_maps_url: hotel.google_maps_url,
        availability: {
          checkIn,
          checkOut,
          available: true,
        },
      }));
    } catch (error) {
      console.error("Error searching hotels:", error);
      throw new Error(`Failed to find hotels: ${error.message}`);
    }
  }
}

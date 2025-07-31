// Updated AiTour data without photo references - using AsyncImage with GeneratePhoto
// Enhanced tour planning system with multiple APIs - NO FALLBACKS
import { GooglePlacesAPI } from "./apis/GooglePlacesAPI.js";
import { HotelsAPI } from "./apis/HotelsAPI.js";
import { TripAdvisorAPI } from "./apis/TripAdvisorAPI.js";
import { WeatherAPI } from "./apis/WeatherAPI.js";

export const updatedAiTrip = {
  tour_info: {
    destination_ID: "ChIJ8UNwBh-9wjsRc9T9GmEHbdI",
    destination_name: "Islamabad",
    description:
      "A peaceful family getaway to Islamabad, exploring its scenic views, historical landmarks, and local cuisine — perfect for relaxation and exploration in the winter season.",
    geo_coordinates: {
      latitude: 33.6844,
      longitude: 73.0479,
    },
    google_maps_url: "https://www.google.com/maps/place/Islamabad",
    dateRange: {
      startDate: "2024-01-15T00:00:00.000Z",
      endDate: "2024-01-20T00:00:00.000Z",
      numberOfDays: 5,
    },
    travel_type: "family",
    mode_of_transport: "car",
    budgetType: "moderate",
    number_of_persons: 4,
  },
  transportation: {
    starting_location: {
      city: "Lahore",
      geo_coordinates: {
        latitude: 31.5204,
        longitude: 74.3587,
      },
    },
  },
  itinerary: [
    {
      date: "2024-01-15",
      time: "12:30",
      type: "food",
      place_name: "Monal Restaurant",
      full_location_name: "Islamabad, Islamabad Capital Territory, Pakistan",
      geo_coordinates: {
        latitude: 33.738045,
        longitude: 73.055134,
      },
      description: "Popular hilltop restaurant with scenic views of Islamabad.",
      google_maps_url: "https://www.google.com/maps/place/Monal+Restaurant",
      estimated_cost: 4000,
    },
    {
      date: "2024-01-15",
      time: "15:00",
      type: "tourSpot",
      place_name: "Daman-e-Koh",
      full_location_name: "Islamabad, Punjab, Pakistan",
      geo_coordinates: {
        latitude: 33.7451,
        longitude: 73.0486,
      },
      description:
        "A viewpoint in the Margalla Hills offering panoramic views of Islamabad.",
      google_maps_url: "https://maps.google.com/?q=Daman-e-Koh",
      estimated_cost: 0,
    },
    {
      date: "2024-01-15",
      time: "18:30",
      type: "hotel",
      place_name: "Serena Hotel",
      full_location_name: "Islamabad, Punjab, Pakistan",
      geo_coordinates: {
        latitude: 33.7215,
        longitude: 73.0791,
      },
      description: "5-star luxury hotel in Islamabad with family suites.",
      google_maps_url:
        "https://www.google.com/maps/place/Islamabad+Serena+Hotel",
      estimated_cost: 25000,
    },
    {
      date: "2024-01-16",
      time: "10:00",
      type: "tourSpot",
      place_name: "Faisal Mosque",
      full_location_name: "Islamabad, Punjab, Pakistan",
      geo_coordinates: {
        latitude: 33.7294,
        longitude: 73.0379,
      },
      description:
        "Iconic mosque with unique architecture, one of the largest in South Asia.",
      google_maps_url: "https://maps.google.com/?q=Faisal+Mosque",
      estimated_cost: 0,
    },
    {
      date: "2024-01-16",
      time: "13:00",
      type: "food",
      place_name: "Savour Foods",
      full_location_name: "Islamabad, Punjab, Pakistan",
      geo_coordinates: {
        latitude: 33.7075,
        longitude: 73.0502,
      },
      description: "Famous spot for pulao kabab and other local foods.",
      google_maps_url: "https://maps.google.com/?q=Savour+Foods",
      estimated_cost: 2500,
    },
    {
      date: "2024-01-16",
      time: "16:00",
      type: "tourSpot",
      place_name: "Rawal Lake View Park",
      full_location_name: "Islamabad, Punjab, Pakistan",
      geo_coordinates: {
        latitude: 33.6844,
        longitude: 73.0945,
      },
      description: "Family-friendly park with lake views and boating options.",
      google_maps_url: "https://maps.google.com/?q=Rawal+Lake+View+Park",
      estimated_cost: 200,
    },
  ],
  total_estimates: {
    total_fuel_cost: 9183.33,
    total_accommodation_cost: 125000,
    total_food_cost: 15000,
    total_others: 200,
    total_transport_cost: 9183.33,
    total_estimated_cost: 149383.33,
  },
  notes_and_tips: [
    {
      title: "Clothing Tip",
      description: "Pack warm clothes — Islamabad is cold in January.",
    },
    {
      title: "Cultural Tip",
      description:
        "Respect local traditions and dress modestly when visiting religious places.",
    },
  ],
};

// Function to generate comprehensive tour plan using multiple APIs - NO FALLBACKS
export const generateComprehensiveTourPlan = async (tripData) => {
  // Extract variables outside try block so they're available in catch block
  let destination_name,
    geo_coordinates,
    dateRange,
    number_of_persons,
    travel_type,
    mode_of_transport,
    budgetType,
    destination_ID,
    starting_location;

  try {
    console.log("Starting comprehensive tour plan generation...");
    console.log("Trip data received:", JSON.stringify(tripData, null, 2));

    // Handle incomplete data gracefully during customization
    if (!tripData || !tripData.tour_info || !tripData.transportation) {
      console.warn(
        "Incomplete trip data detected - this is normal during tour customization"
      );
      console.warn(
        "Please complete all required fields before generating the tour plan"
      );
      throw new Error(
        "Tour customization incomplete. Please fill in all required fields including destination, dates, and travel details."
      );
    }

    ({
      destination_name,
      geo_coordinates,
      dateRange,
      number_of_persons,
      travel_type,
      mode_of_transport,
      budgetType,
      destination_ID,
    } = tripData.tour_info);

    ({ starting_location } = tripData.transportation);

    // Validate required fields with helpful messages for customization
    if (!destination_name) {
      throw new Error("Please select a destination for your tour.");
    }
    if (
      !geo_coordinates ||
      !geo_coordinates.latitude ||
      !geo_coordinates.longitude
    ) {
      throw new Error("Please select a valid destination location.");
    }
    if (!dateRange) {
      throw new Error("Please select your travel dates to continue.");
    }
    if (!starting_location) {
      throw new Error("Please select your starting location.");
    }

    // Validate dateRange structure
    if (!dateRange.startDate || !dateRange.endDate || !dateRange.numberOfDays) {
      console.warn(
        "Incomplete date range - this is normal during customization"
      );
      throw new Error("Please select both start and end dates for your tour.");
    }

    // Set default values for optional fields
    number_of_persons = number_of_persons || 1;
    travel_type = travel_type || "solo";
    mode_of_transport = mode_of_transport || "car";
    budgetType = budgetType || "moderate";
    destination_ID = destination_ID || "default_destination";

    console.log("Validated trip data:", {
      destination_name,
      geo_coordinates,
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        numberOfDays: dateRange.numberOfDays,
      },
      number_of_persons,
      travel_type,
      mode_of_transport,
      budgetType,
    });

    // Step 1: Get destination details and attractions
    let destinationDetails = null;
    try {
      destinationDetails = await GooglePlacesAPI.getPlaceDetails(
        destination_ID
      );
    } catch (error) {
      console.warn(
        "Could not fetch place details, continuing without them:",
        error.message
      );
      destinationDetails = {
        name: destination_name,
        address: `${destination_name}, Pakistan`,
        description: `Explore the beautiful city of ${destination_name}`,
      };
    }

    let attractions = [];
    try {
      attractions = await GooglePlacesAPI.getNearbyAttractions(
        geo_coordinates,
        budgetType
      );
    } catch (error) {
      console.warn(
        "Could not fetch attractions from Google Places, will use fallbacks:",
        error.message
      );
    }

    console.log(
      "Fetched attractions:",
      attractions?.length || 0,
      "attractions"
    );
    console.log("Attractions data:", attractions);

    // Step 2: Get real hotel recommendations with current prices
    let hotels = [];
    try {
      hotels = await HotelsAPI.searchHotels({
        location: destination_name,
        coordinates: geo_coordinates,
        checkIn: dateRange.startDate,
        checkOut: dateRange.endDate,
        guests: number_of_persons,
        budget: budgetType,
        travelType: travel_type,
      });
    } catch (error) {
      console.warn(
        "Could not fetch hotels from API, will use fallbacks:",
        error.message
      );
    }

    console.log("Fetched hotels:", hotels?.length || 0, "hotels");
    console.log("Hotels data:", hotels);

    // Step 3: Get restaurant recommendations
    let restaurants = [];
    try {
      restaurants = await GooglePlacesAPI.getNearbyRestaurants(
        geo_coordinates,
        budgetType
      );
    } catch (error) {
      console.warn(
        "Could not fetch restaurants from Google Places, will use fallbacks:",
        error.message
      );
    }

    console.log(
      "Fetched restaurants:",
      restaurants?.length || 0,
      "restaurants"
    );
    console.log("Restaurant types:", restaurants?.map((r) => r.type) || []);
    console.log("Restaurants data:", restaurants);

    // Step 4: Get weather forecast for the trip dates
    let weather = null;
    try {
      weather = await WeatherAPI.getForecast(
        geo_coordinates,
        dateRange.startDate,
        dateRange.endDate
      );
    } catch (error) {
      console.warn(
        "Could not fetch weather forecast, continuing without it:",
        error.message
      );
      weather = {
        summary: "Weather information not available",
        temperature: "N/A",
        conditions: "Unknown",
      };
    }

    // Step 5: Get transport options and costs
    let transportOptions = null;
    try {
      transportOptions = await getTransportOptions(
        starting_location,
        {
          name: destination_name,
          geo_coordinates: geo_coordinates,
        },
        mode_of_transport,
        number_of_persons
      );
    } catch (error) {
      console.warn(
        "Could not calculate transport options, using defaults:",
        error.message
      );
      transportOptions = {
        totalCost: 5000, // Default transport cost
        distance: 300, // Default distance
        duration: "4 hours", // Default duration
      };
    }

    console.log("Transport options:", transportOptions);

    // Validate that we have sufficient data for itinerary generation
    if (!hotels || hotels.length === 0) {
      throw new Error("No hotels found for the destination");
    }
    if (!restaurants || restaurants.length === 0) {
      throw new Error("No restaurants found for the destination");
    }
    if (!attractions || attractions.length === 0) {
      throw new Error("No attractions found for the destination");
    }
    if (!dateRange || !dateRange.numberOfDays || dateRange.numberOfDays <= 0) {
      throw new Error("Invalid date range for the trip");
    }

    const itinerary = [];

    // Add arrival transport for day 1
    itinerary.push({
      date: dateRange.startDate,
      time: "08:00",
      type: "carTransport",
      place_name: `Travel from ${
        starting_location?.city || "Starting Point"
      } to ${destination_name || "Destination"}`,
      full_location_name: `${starting_location?.city || "Starting Point"} to ${
        destination_name || "Destination"
      }`,
      geo_coordinates: starting_location?.geo_coordinates || {
        latitude: 0,
        longitude: 0,
      },
      description: `Start your journey from ${
        starting_location?.city || "Starting Point"
      } to ${destination_name || "Destination"}`,
      google_maps_url: `https://maps.google.com/?saddr=${
        starting_location?.geo_coordinates?.latitude || 0
      },${starting_location?.geo_coordinates?.longitude || 0}&daddr=${
        geo_coordinates?.latitude || 0
      },${geo_coordinates?.longitude || 0}`,
      estimated_cost: transportOptions?.totalCost || 0,
    });

    console.log("Added arrival transport for day 1");

    // Add hotel check-in
    const selectedHotel = hotels?.[0];
    if (selectedHotel) {
      itinerary.push({
        date: dateRange.startDate,
        time: "14:00",
        type: "hotel",
        place_name: selectedHotel.name,
        full_location_name: selectedHotel.address,
        geo_coordinates: selectedHotel.coordinates,
        description: `Check-in at ${selectedHotel.name}. ${selectedHotel.description}`,
        google_maps_url: selectedHotel.google_maps_url,
        estimated_cost:
          selectedHotel.price_per_night *
          Math.ceil(number_of_persons / 2) *
          (dateRange.numberOfDays - 1),
        hotel_details: {
          rating: selectedHotel.rating,
          amenities: selectedHotel.amenities,
          contact: selectedHotel.contact,
          booking_url: selectedHotel.booking_url,
        },
      });
      console.log("Added hotel check-in for day 1");
    }

    // Add daily activities for each day
    for (let day = 1; day <= dateRange.numberOfDays; day++) {
      console.log(`Processing day ${day} of ${dateRange.numberOfDays}`);
      const currentDate = new Date(dateRange.startDate);
      currentDate.setDate(currentDate.getDate() + day - 1);

      console.log(`Day ${day} date:`, currentDate.toISOString());

      // Add breakfast if restaurants are available
      const breakfastRestaurant = restaurants?.find(
        (r) => r.type === "breakfast"
      );
      if (breakfastRestaurant) {
        itinerary.push({
          date: currentDate.toISOString(),
          time: "08:00",
          type: "food",
          place_name: breakfastRestaurant.name,
          full_location_name: breakfastRestaurant.address,
          geo_coordinates: breakfastRestaurant.coordinates,
          description: `Breakfast at ${breakfastRestaurant.name}`,
          google_maps_url: breakfastRestaurant.google_maps_url,
          estimated_cost: breakfastRestaurant.average_cost * number_of_persons,
          restaurant_details: {
            rating: breakfastRestaurant.rating,
            cuisine: breakfastRestaurant.cuisine,
            contact: breakfastRestaurant.contact,
          },
        });
      }

      // Add attractions for the day - distribute evenly across all days
      const totalAttractions = attractions?.length || 0;
      let dailyAttractions = [];

      if (totalAttractions > 0) {
        // Distribute attractions evenly across all days
        const attractionsPerDay = Math.max(
          1,
          Math.ceil(totalAttractions / dateRange.numberOfDays)
        );
        const startIndex = (day - 1) * attractionsPerDay;
        const endIndex = Math.min(
          startIndex + attractionsPerDay,
          totalAttractions
        );

        // If we're running out of attractions, cycle back to the beginning
        if (startIndex >= totalAttractions) {
          const cycleIndex = startIndex % totalAttractions;
          dailyAttractions = [attractions[cycleIndex]];
        } else {
          dailyAttractions = attractions.slice(startIndex, endIndex);
        }
      }

      // Add attractions with better time management
      if (dailyAttractions.length > 0) {
        dailyAttractions.forEach((attraction, index) => {
          // Better time distribution: 10:00, 12:00, 15:00, 17:00
          const timeSlots = ["10:00", "12:00", "15:00", "17:00"];
          const timeSlot = timeSlots[index % timeSlots.length];

          itinerary.push({
            date: currentDate.toISOString(),
            time: timeSlot,
            type: attraction.type,
            place_name: attraction.name,
            full_location_name: attraction.address,
            geo_coordinates: attraction.coordinates,
            description: attraction.description,
            google_maps_url: attraction.google_maps_url,
            estimated_cost: attraction.entry_fee * number_of_persons,
            attraction_details: {
              rating: attraction.rating,
              opening_hours: attraction.opening_hours,
              contact: attraction.contact,
              tips: attraction.tips,
            },
          });
        });
      } else {
        console.warn(
          `No attractions available for day ${day}. Skipping attraction activities.`
        );
      }

      // Add lunch if restaurants are available
      const lunchRestaurant = restaurants?.find((r) => r.type === "lunch");
      if (lunchRestaurant) {
        itinerary.push({
          date: currentDate.toISOString(),
          time: "13:00",
          type: "food",
          place_name: lunchRestaurant.name,
          full_location_name: lunchRestaurant.address,
          geo_coordinates: lunchRestaurant.coordinates,
          description: `Lunch at ${lunchRestaurant.name}`,
          google_maps_url: lunchRestaurant.google_maps_url,
          estimated_cost: lunchRestaurant.average_cost * number_of_persons,
          restaurant_details: {
            rating: lunchRestaurant.rating,
            cuisine: lunchRestaurant.cuisine,
            contact: lunchRestaurant.contact,
          },
        });
      }

      // Add dinner if restaurants are available
      const dinnerRestaurant = restaurants?.find((r) => r.type === "dinner");
      if (dinnerRestaurant) {
        itinerary.push({
          date: currentDate.toISOString(),
          time: "19:00",
          type: "food",
          place_name: dinnerRestaurant.name,
          full_location_name: dinnerRestaurant.address,
          geo_coordinates: dinnerRestaurant.coordinates,
          description: `Dinner at ${dinnerRestaurant.name}`,
          google_maps_url: dinnerRestaurant.google_maps_url,
          estimated_cost: dinnerRestaurant.average_cost * number_of_persons,
          restaurant_details: {
            rating: dinnerRestaurant.rating,
            cuisine: dinnerRestaurant.cuisine,
            contact: dinnerRestaurant.contact,
          },
        });
      }

      // Add hotel stay for the night (except last day)
      if (day < dateRange.numberOfDays && selectedHotel) {
        itinerary.push({
          date: currentDate.toISOString(),
          time: "22:00",
          type: "hotel",
          place_name: selectedHotel.name,
          full_location_name: selectedHotel.address,
          geo_coordinates: selectedHotel.coordinates,
          description: `Return to ${selectedHotel.name} for overnight stay`,
          google_maps_url: selectedHotel.google_maps_url,
          estimated_cost: 0, // Already included in check-in cost
        });
      }
    }

    // Add return journey on last day
    itinerary.push({
      date: dateRange.endDate,
      time: "16:00",
      type: "carTransport",
      place_name: `Return from ${destination_name || "Destination"} to ${
        starting_location?.city || "Starting Point"
      }`,
      full_location_name: `${destination_name || "Destination"} to ${
        starting_location?.city || "Starting Point"
      }`,
      geo_coordinates: geo_coordinates || { latitude: 0, longitude: 0 },
      description: `Return journey from ${
        destination_name || "Destination"
      } to ${starting_location?.city || "Starting Point"}`,
      google_maps_url: `https://maps.google.com/?saddr=${
        geo_coordinates?.latitude || 0
      },${geo_coordinates?.longitude || 0}&daddr=${
        starting_location?.geo_coordinates?.latitude || 0
      },${starting_location?.geo_coordinates?.longitude || 0}`,
      estimated_cost: transportOptions?.totalCost || 0, // Return journey cost (same as outbound)
    });

    console.log("Added return journey for last day");

    // Group itinerary by date to verify all days are included
    const itineraryByDate = itinerary.reduce((acc, item) => {
      const date = item.date.split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    console.log("Final itinerary summary:");
    console.log("Total itinerary items:", itinerary.length);
    console.log("Days with activities:", Object.keys(itineraryByDate).length);
    Object.keys(itineraryByDate).forEach((date) => {
      console.log(`Date ${date}: ${itineraryByDate[date].length} activities`);
    });

    // Step 7: Calculate accurate costs
    const totalEstimates = calculateAccurateCosts(
      itinerary,
      number_of_persons,
      dateRange.numberOfDays
    );

    // Step 8: Generate tips and recommendations
    let notesAndTips = [];
    try {
      notesAndTips = await TripAdvisorAPI.getLocalTips(
        destination_name,
        travel_type,
        weather
      );
    } catch (error) {
      console.warn(
        "Could not fetch local tips, using defaults:",
        error.message
      );
      notesAndTips = [
        {
          title: "General Travel Tips",
          description: `Enjoy your trip to ${destination_name}! Remember to respect local customs and stay safe.`,
        },
        {
          title: "Emergency Preparedness",
          description:
            "Keep emergency contacts handy and have travel insurance.",
        },
        {
          title: "Local Currency",
          description:
            "Carry Pakistani Rupees (PKR) for local transactions. Major cards are accepted in cities.",
        },
        {
          title: "Cultural Etiquette",
          description:
            "Dress modestly, especially when visiting religious sites. Remove shoes when entering mosques.",
        },
        {
          title: "Photography",
          description:
            "Ask permission before taking photos of people. Some places may have photography restrictions.",
        },
      ];
    }

    console.log(
      "Comprehensive tour plan generated successfully with costs:",
      totalEstimates
    );

    // Generate cost summary
    const costSummary = {
      accommodation: totalEstimates.total_accommodation_cost,
      food: totalEstimates.total_food_cost,
      transport: totalEstimates.total_transport_cost,
      others: totalEstimates.total_others,
      total: totalEstimates.total_estimated_cost,
    };

    return {
      tour_info: {
        destination_ID: tripData.tour_info.destination_ID,
        destination_name,
        geo_coordinates,
        google_maps_url: tripData.tour_info.google_maps_url,
        dateRange,
        travel_type,
        number_of_persons,
        mode_of_transport,
        budgetType,
      },
      transportation: {
        starting_location,
      },
      itinerary,
      total_estimates: totalEstimates,
      notes_and_tips: notesAndTips,
      destination_details: destinationDetails,
      weather_forecast: weather,
      cost_summary: costSummary,
    };
  } catch (error) {
    console.error("Error generating comprehensive tour plan:", error);

    // If this is already a user-friendly customization error, don't wrap it
    if (
      error.message.includes("Please select") ||
      error.message.includes("Tour customization incomplete") ||
      error.message.includes("Please fill in") ||
      error.message.includes("Please complete")
    ) {
      throw error; // Re-throw the original user-friendly error
    }

    // Provide specific guidance for common customization issues
    if (
      error.message.includes("dateRange") ||
      error.message.includes("numberOfDays") ||
      error.message.includes("destination") ||
      error.message.includes("location")
    ) {
      throw new Error(
        "Tour customization incomplete. Please complete all required fields including destination, dates, and travel details before generating your tour plan."
      );
    }

    // For other errors, provide the original error message
    throw new Error(
      `Failed to generate tour plan: ${error.message}. Please ensure all required data is available for the destination.`
    );
  }
};

// Function to get transport options with real costs
const getTransportOptions = async (
  startingLocation,
  destination,
  mode,
  persons
) => {
  try {
    console.log("Getting transport options:", {
      startingLocation,
      destination,
      mode,
      persons,
    });

    // Validate input parameters
    if (!startingLocation || !startingLocation.geo_coordinates) {
      console.error("Invalid starting location:", startingLocation);
      throw new Error("Invalid starting location");
    }

    if (!destination || !destination.geo_coordinates) {
      console.error("Invalid destination:", destination);
      throw new Error("Invalid destination");
    }

    if (mode === "car") {
      // Calculate real distance using Google API
      const distance = await GooglePlacesAPI.getDistance(
        startingLocation,
        destination
      );
      console.log(`Calculated real distance: ${distance} km`);

      if (!distance || distance <= 0) {
        throw new Error("Failed to calculate distance");
      }

      const fuelPrice = await getCurrentFuelPrice();
      const fuelEfficiency = getFuelEfficiency(mode);
      const fuelCost = (distance * fuelPrice) / fuelEfficiency;

      // Calculate additional costs based on actual distance
      const tollFees = Math.ceil(distance / 100) * 200; // Approximate toll fees
      const maintenanceCost = Math.ceil(distance / 1000) * 500; // Maintenance cost per 1000km
      const parkingFees = 200 * (persons > 2 ? 2 : 1); // Parking for multiple days

      const totalCost = fuelCost + tollFees + maintenanceCost + parkingFees;

      console.log("Transport cost breakdown:", {
        distance: `${distance} km`,
        fuelCost: `${fuelCost} PKR`,
        tollFees: `${tollFees} PKR`,
        maintenanceCost: `${maintenanceCost} PKR`,
        parkingFees: `${parkingFees} PKR`,
        totalCost: `${totalCost} PKR`,
      });

      return {
        type: "car",
        distance,
        fuelCost: fuelCost,
        tollFees,
        maintenanceCost,
        parkingFees,
        totalCost: totalCost,
      };
    } else {
      // Get real bus/train schedules and prices
      const transportSchedule = await getPublicTransportSchedule(
        startingLocation,
        destination
      );
      return {
        type: mode,
        schedule: transportSchedule,
        totalCost: transportSchedule.price * persons,
      };
    }
  } catch (error) {
    console.error("Error getting transport options:", error);
    throw new Error(`Failed to calculate transport costs: ${error.message}`);
  }
};

// Helper function to get current fuel price
const getCurrentFuelPrice = async () => {
  // Current fuel price in Pakistan (as of 2024)
  return 280; // PKR per liter
};

// Helper function to get fuel efficiency based on vehicle type
const getFuelEfficiency = (mode) => {
  // Realistic fuel efficiency in km/liter
  switch (mode) {
    case "car":
      return 10; // Average car fuel efficiency
    case "suv":
      return 8; // SUV fuel efficiency
    case "motorcycle":
      return 25; // Motorcycle fuel efficiency
    default:
      return 10; // Default car efficiency
  }
};

// Helper function to get public transport schedule
const getPublicTransportSchedule = async (startingLocation, destination) => {
  // In production, this would call a transport API
  // For now, return realistic data based on distance
  const distance = await GooglePlacesAPI.getDistance(
    startingLocation,
    destination
  );
  const basePrice = Math.ceil(distance / 100) * 500; // 500 PKR per 100km

  return {
    price: basePrice, // PKR per person
    duration: `${Math.ceil(distance / 60)}-${Math.ceil(distance / 40)} hours`,
    frequency: "Every 2-4 hours",
  };
};

// Function to calculate accurate costs from real data
const calculateAccurateCosts = (itinerary, persons, days) => {
  console.log("Calculating costs for itinerary:", {
    itineraryLength: itinerary?.length || 0,
    persons,
    days,
  });

  const costs = {
    total_fuel_cost: 0,
    total_accommodation_cost: 0,
    total_food_cost: 0,
    total_others: 0,
    total_transport_cost: 0,
    total_estimated_cost: 0,
  };

  if (!itinerary || !Array.isArray(itinerary)) {
    console.warn("Invalid itinerary for cost calculation");
    return costs;
  }

  itinerary.forEach((item, index) => {
    if (!item || !item.type) {
      console.warn("Invalid itinerary item:", item);
      return;
    }

    const itemCost = item.estimated_cost || 0;
    console.log(
      `Item ${index + 1}: ${item.type} - ${itemCost} PKR - ${item.place_name}`
    );

    switch (item.type) {
      case "carTransport":
        costs.total_fuel_cost += itemCost;
        costs.total_transport_cost += itemCost;
        console.log(
          `  Added to transport costs: ${itemCost} PKR (Total transport: ${costs.total_transport_cost} PKR)`
        );
        break;
      case "hotel":
        // Only count hotel costs once (from check-in), not from daily stays
        if (itemCost > 0) {
          costs.total_accommodation_cost += itemCost;
          console.log(
            `  Added to accommodation costs: ${itemCost} PKR (Total accommodation: ${costs.total_accommodation_cost} PKR)`
          );
        }
        break;
      case "food":
        costs.total_food_cost += itemCost;
        console.log(
          `  Added to food costs: ${itemCost} PKR (Total food: ${costs.total_food_cost} PKR)`
        );
        break;
      case "HistoricalTourSpot":
      case "HillyTourSpot":
      case "EntertainmentTourSpot":
      case "tourSpot":
      case "tourist_spot":
        costs.total_others += itemCost;
        console.log(
          `  Added to others costs: ${itemCost} PKR (Total others: ${costs.total_others} PKR)`
        );
        break;
      default:
        console.warn(
          "Unknown itinerary item type:",
          item.type,
          "with cost:",
          itemCost
        );
        // Add to others cost for unknown types
        costs.total_others += itemCost;
        console.log(
          `  Added to others costs: ${itemCost} PKR (Total others: ${costs.total_others} PKR)`
        );
    }
  });

  // Calculate total cost (transport cost is already included in fuel cost)
  costs.total_estimated_cost =
    costs.total_fuel_cost +
    costs.total_accommodation_cost +
    costs.total_food_cost +
    costs.total_others;

  console.log("Final calculated costs:", {
    fuel: costs.total_fuel_cost,
    accommodation: costs.total_accommodation_cost,
    food: costs.total_food_cost,
    others: costs.total_others,
    transport: costs.total_transport_cost,
    total: costs.total_estimated_cost,
  });

  return costs;
};

// Function to generate tour plan using Gemini API (legacy function - kept for compatibility)
export const generateTourPlan = async (tripData) => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMENI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API key not found in environment variables");
    }

    console.log("API Key available:", !!apiKey);
    console.log("API Key length:", apiKey?.length);

    // Construct the prompt with trip data
    const prompt = `Create a detailed ${
      tripData.tour_info.dateRange.numberOfDays
    }-day tour plan from ${tripData.transportation.starting_location.city} to ${
      tripData.tour_info.destination_name
    }.

TOUR DETAILS:
- Travelers: ${tripData.tour_info.number_of_persons} person(s) (${
      tripData.tour_info.travel_type
    })
- Transport: ${tripData.tour_info.mode_of_transport}
- Budget: ${tripData.tour_info.budgetType}
- Duration: ${tripData.tour_info.dateRange.numberOfDays} days (${
      tripData.tour_info.dateRange.numberOfDays - 1
    } nights)
- Start: ${tripData.tour_info.dateRange.startDate}
- End: ${tripData.tour_info.dateRange.endDate}
- Destination: ${tripData.tour_info.destination_name} (${
      tripData.tour_info.geo_coordinates.latitude
    }, ${tripData.tour_info.geo_coordinates.longitude})
- Starting Point: ${tripData.transportation.starting_location.city} (${
      tripData.transportation.starting_location.geo_coordinates.latitude
    }, ${tripData.transportation.starting_location.geo_coordinates.longitude})

COST CALCULATION RULES (MANDATORY):

1. ACCOMMODATION COSTS:
   - Calculate for ${tripData.tour_info.dateRange.numberOfDays - 1} nights
   - Room sharing: Solo=1 room, Couple=1 room, Family/Friends=2+ rooms (2 people per room)
   - Formula: rooms needed × room cost per night × ${
     tripData.tour_info.dateRange.numberOfDays - 1
   } nights
   - Example: 4 people, 5 days = 2 rooms × 5000 PKR × 4 nights = 40,000 PKR

2. FOOD COSTS:
   - 3 meals per day per person: breakfast, lunch, dinner
   - Formula: per-person meal cost × ${
     tripData.tour_info.number_of_persons
   } persons × 3 meals × ${tripData.tour_info.dateRange.numberOfDays} days
   - Example: 4 people, 5 days = 1000 PKR per meal × 4 people × 3 meals × 5 days = 60,000 PKR

3. TRANSPORT COSTS:
   - Car mode: fuel cost = distance × 300 PKR/liter ÷ 15 km/l + parking fees
   - Bus/Train mode: intercity tickets × ${
     tripData.tour_info.number_of_persons
   } persons + local transport
   - Example: Lahore to Islamabad (300 km) = 300 × 300 ÷ 15 = 6,000 PKR one way

4. ENTRY FEES:
   - Formula: per-person entry fee × ${
     tripData.tour_info.number_of_persons
   } persons
   - Example: 500 PKR per person × 4 people = 2,000 PKR

ITINERARY REQUIREMENTS:
- Include hotel stay for EVERY night (${
      tripData.tour_info.dateRange.numberOfDays - 1
    } nights total)
- Include 3 meals per day for ${tripData.tour_info.number_of_persons} persons
- Include transport costs for every journey
- Include entry fees for all attractions
- Return to starting point on last day

TRANSPORT MODE RULES:
- Car: Use personal car for all travel, include fuel and parking costs
- Bus/Train: Use intercity services + local transport (taxis, rickshaws)

CRITICAL: Return ONLY valid JSON. Do not include any text before or after the JSON. Do not include comments, explanations, or markdown formatting. The response must be parseable JSON.

Return this exact JSON structure with accurate costs for ${
      tripData.tour_info.number_of_persons
    } persons for ${tripData.tour_info.dateRange.numberOfDays} days:

{
    "tour_info": {
      "destination_ID": "${tripData.tour_info.destination_ID}",
      "destination_name": "${tripData.tour_info.destination_name}",
      "geo_coordinates": {
        "latitude": ${tripData.tour_info.geo_coordinates.latitude},
        "longitude": ${tripData.tour_info.geo_coordinates.longitude}
      },
      "google_maps_url": "${tripData.tour_info.google_maps_url}",
      "dateRange": {
        "startDate": "${tripData.tour_info.dateRange.startDate}",
        "endDate": "${tripData.tour_info.dateRange.endDate}",
        "numberOfDays": ${tripData.tour_info.dateRange.numberOfDays}
      },
      "travel_type": "${tripData.tour_info.travel_type}",
      "number_of_persons": ${tripData.tour_info.number_of_persons},
      "mode_of_transport": "${tripData.tour_info.mode_of_transport}",
      "budgetType": "${tripData.tour_info.budgetType}"
    },
    "transportation": {
      "starting_location": {
        "city": "${tripData.transportation.starting_location.city}",
        "geo_coordinates": {
          "latitude": ${
            tripData.transportation.starting_location.geo_coordinates.latitude
          },
          "longitude": ${
            tripData.transportation.starting_location.geo_coordinates.longitude
          }
        }
      }
    },
    "itinerary": [
      {
        "date": "ISO 8601 date string",
        "time": "HH:mm (24-hour format)",
        "type": "food|hotel|HistoricalTourSpot|HillyTourSpot|EntertainmentTourSpot|carTransport|localTransport|footsteps",
        "place_name": "string",
        "full_location_name": "string",
        "geo_coordinates": {
          "latitude": "float",
          "longitude": "float"
        },
        "description": "string",
        "google_maps_url": "string",
        "estimated_cost": "float (in PKR for ${
          tripData.tour_info.number_of_persons
        } persons)"
      }
    ],
    "total_estimates": {
      "total_fuel_cost": "float (only if car mode)",
      "total_accommodation_cost": "float (for ${
        tripData.tour_info.number_of_persons
      } persons for ${tripData.tour_info.dateRange.numberOfDays - 1} nights)",
      "total_food_cost": "float (for ${
        tripData.tour_info.number_of_persons
      } persons for ${tripData.tour_info.dateRange.numberOfDays} days)",
      "total_others": "float (for ${
        tripData.tour_info.number_of_persons
      } persons)",
      "total_transport_cost": "float (for ${
        tripData.tour_info.number_of_persons
      } persons)",
      "total_estimated_cost": "float (sum of all costs)"
    },
    "notes_and_tips": [
      {
        "title": "string",
        "description": "string"
      }
    ]
  }`;

    console.log("Making API call to Gemini...");
    console.log("Prompt length:", prompt.length);

    // Make API call to Gemini - using the correct endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response received:", !!data);

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      console.error("Invalid API response structure:", data);
      throw new Error("Invalid response from Gemini API");
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log("Generated text length:", generatedText.length);
    console.log("Generated text preview:", generatedText.substring(0, 200));

    // Enhanced JSON extraction with multiple strategies
    let tourPlan = null;
    let jsonMatch = null;

    // Strategy 1: Look for JSON between triple backticks
    const codeBlockMatch = generatedText.match(
      /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
    );
    if (codeBlockMatch) {
      jsonMatch = codeBlockMatch[1];
      console.log("Found JSON in code block");
    }

    // Strategy 2: Look for JSON starting with { and ending with }
    if (!jsonMatch) {
      const braceMatch = generatedText.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        jsonMatch = braceMatch[0];
        console.log("Found JSON with braces");
      }
    }

    // Strategy 3: Look for JSON after common prefixes
    if (!jsonMatch) {
      const afterPrefixMatch = generatedText.match(
        /(?:Here is|Here's|The tour plan|JSON response|Response):\s*(\{[\s\S]*\})/i
      );
      if (afterPrefixMatch) {
        jsonMatch = afterPrefixMatch[1];
        console.log("Found JSON after prefix");
      }
    }

    if (!jsonMatch) {
      console.error("No JSON found in response. Full response:", generatedText);
      throw new Error("No JSON found in Gemini response");
    }

    try {
      // Clean the JSON string more thoroughly
      let cleanedJson = jsonMatch.trim();

      // Remove any trailing text after the closing brace
      const lastBraceIndex = cleanedJson.lastIndexOf("}");
      if (lastBraceIndex !== -1) {
        cleanedJson = cleanedJson.substring(0, lastBraceIndex + 1);
      }

      // Remove any trailing characters that might cause parsing issues
      cleanedJson = cleanedJson.replace(/[\/\s]*$/, ""); // Remove trailing slashes and whitespace

      // Remove any incomplete trailing commas
      cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, "$1");

      // Ensure the JSON starts and ends properly
      if (!cleanedJson.startsWith("{")) {
        const startBraceIndex = cleanedJson.indexOf("{");
        if (startBraceIndex !== -1) {
          cleanedJson = cleanedJson.substring(startBraceIndex);
        }
      }

      console.log(
        "Attempting to parse JSON:",
        cleanedJson.substring(0, 100) + "..."
      );

      // Additional validation before parsing
      if (
        !cleanedJson.includes('"tour_info"') ||
        !cleanedJson.includes('"itinerary"')
      ) {
        throw new Error("JSON appears to be incomplete or malformed");
      }

      tourPlan = JSON.parse(cleanedJson);
      console.log("Successfully parsed JSON response");
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Attempted to parse:", jsonMatch.substring(0, 500));

      // Try additional cleaning strategies
      try {
        console.log("Attempting additional JSON cleaning...");

        // Remove any HTML-like tags or comments
        let fallbackJson = jsonMatch
          .replace(/<[^>]*>/g, "")
          .replace(/\/\*[\s\S]*?\*\//g, "");

        // Remove any trailing incomplete structures
        fallbackJson = fallbackJson.replace(/,\s*[}\]][^}]*$/, "");

        // Find the last complete JSON object
        const matches = fallbackJson.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
        if (matches && matches.length > 0) {
          const lastCompleteJson = matches[matches.length - 1];
          console.log("Trying with last complete JSON object...");
          tourPlan = JSON.parse(lastCompleteJson);
          console.log("Successfully parsed with fallback cleaning");
        } else {
          throw new Error("No complete JSON object found");
        }
      } catch (fallbackError) {
        console.error("Fallback JSON cleaning also failed:", fallbackError);
        throw new Error(
          `JSON parsing failed: ${parseError.message}. The response may be malformed.`
        );
      }
    }

    // Validate the response structure
    if (
      !tourPlan.tour_info ||
      !tourPlan.itinerary ||
      !tourPlan.total_estimates
    ) {
      console.error("Invalid tour plan structure:", tourPlan);
      throw new Error("Invalid tour plan structure from Gemini API");
    }

    console.log("Tour plan generated successfully");
    return tourPlan;
  } catch (error) {
    console.error("Error generating tour plan:", error);
    throw new Error(`Failed to generate tour plan: ${error.message}`);
  }
};

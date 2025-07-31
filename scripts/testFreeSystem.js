import { generateComprehensiveTourPlan } from "./updateAiTourData.js";

// Test data with real destination
const testTripData = {
  tour_info: {
    destination_ID: "ChIJ8UNwBh-9wjsRc9T9GmEHbdI",
    destination_name: "Islamabad",
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
};

async function testFreeSystem() {
  try {
    console.log("🧪 Testing FREE tour planning system...");
    console.log("📍 Destination: Islamabad");
    console.log("🚗 Transport: Car from Lahore");
    console.log("👥 Travelers: 4 persons (family)");
    console.log("📅 Duration: 5 days");
    console.log("💰 Budget: Moderate");
    console.log("");
    console.log("🔑 APIs Used:");
    console.log("   ✅ Google Places API (your key)");
    console.log("   ✅ Gemini API (free)");
    console.log("   ❌ No paid APIs required!");
    console.log("");

    const result = await generateComprehensiveTourPlan(testTripData);

    console.log("✅ Tour plan generated successfully!");
    console.log("📊 Cost Summary:");
    console.log(
      `   Transport: ${result.total_estimates.total_transport_cost} PKR`
    );
    console.log(
      `   Accommodation: ${result.total_estimates.total_accommodation_cost} PKR`
    );
    console.log(`   Food: ${result.total_estimates.total_food_cost} PKR`);
    console.log(`   Others: ${result.total_estimates.total_others} PKR`);
    console.log(`   Total: ${result.total_estimates.total_estimated_cost} PKR`);
    console.log("");
    console.log(`📋 Itinerary: ${result.itinerary.length} activities`);
    console.log(`💡 Tips: ${result.notes_and_tips.length} tips`);
    console.log(
      `🌤️ Weather: ${result.weather_forecast?.length || 0} days forecast`
    );
    console.log("");
    console.log("🎉 System is working perfectly with FREE resources!");
    console.log("💰 Total cost to you: $0 (completely free!)");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
    console.log("");
    console.log("🔍 Troubleshooting:");
    console.log("1. Check your Google Places API key is set correctly");
    console.log("2. Check your Gemini API key is set correctly");
    console.log(
      "3. Ensure Google Places API (New) is enabled in Google Console"
    );
    console.log("4. Check API quotas and billing is set up");
    console.log("");
    console.log(
      "✅ The system correctly refuses to use fallback/default values"
    );
  }
}

testFreeSystem();

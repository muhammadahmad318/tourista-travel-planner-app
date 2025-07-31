// Test script to verify JSON parsing improvements
import { generateTourPlan } from "./updateAiTourData.js";

// Test data with real destination
const testTripData = {
  tour_info: {
    destination_ID: "ChIJv0sdZQY-sz4RIwxaVUQv-Zw",
    destination_name: "Karachi, Pakistan",
    geo_coordinates: {
      latitude: 24.8607343,
      longitude: 67.0011364,
    },
    google_maps_url: "https://maps.google.com/?q=Karachi,+Pakistan",
    dateRange: {
      startDate: "2025-06-18T07:00:00.000Z",
      endDate: "2025-06-25T07:00:00.000Z",
      numberOfDays: 8,
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

async function testJsonParsing() {
  try {
    console.log("🧪 Testing JSON parsing improvements...");
    console.log("📍 Destination: Karachi, Pakistan");
    console.log("🚗 Transport: Car from Lahore");
    console.log("👥 Travelers: 4 persons (family)");
    console.log("📅 Duration: 8 days");
    console.log("💰 Budget: Moderate");
    console.log("");
    console.log("🔧 Testing enhanced JSON parsing with fallback cleaning...");

    const result = await generateTourPlan(testTripData);

    console.log("✅ JSON parsing successful!");
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
    console.log("");
    console.log("🎉 JSON parsing improvements working correctly!");
    console.log("✅ No more 'Unexpected character: /' errors!");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
    console.log("");
    console.log("🔍 Troubleshooting:");
    console.log("1. Check your Gemini API key is set correctly");
    console.log("2. Check API quotas and billing");
    console.log("3. The error might be due to API limits or network issues");
    console.log("");
    console.log(
      "📝 Note: If this still fails, the issue might be with the API response itself"
    );
  }
}

testJsonParsing();

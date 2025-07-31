import { generateComprehensiveTourPlan } from "./updateAiTourData.js";

const testTourPlan = async () => {
  try {
    console.log("🚀 Testing comprehensive tour plan generation...\n");

    const testTripData = {
      tour_info: {
        destination_ID: "test_destination",
        destination_name: "Lahore",
        geo_coordinates: {
          latitude: 31.5497,
          longitude: 74.3436,
        },
        google_maps_url: "https://maps.google.com/?q=Lahore",
        dateRange: {
          startDate: "2024-01-15",
          endDate: "2024-01-19",
          numberOfDays: 5,
        },
        travel_type: "family",
        number_of_persons: 4,
        mode_of_transport: "car",
        budgetType: "moderate",
      },
      transportation: {
        starting_location: {
          city: "Islamabad",
          geo_coordinates: {
            latitude: 33.6844,
            longitude: 73.0479,
          },
        },
      },
    };

    console.log("📋 Test trip data:", JSON.stringify(testTripData, null, 2));
    console.log("\n🔄 Generating tour plan...\n");

    const result = await generateComprehensiveTourPlan(testTripData);

    console.log("✅ Tour plan generated successfully!\n");

    // Display tour info
    console.log("📍 Tour Information:");
    console.log(`   Destination: ${result.tour_info.destination_name}`);
    console.log(`   Duration: ${result.tour_info.dateRange.numberOfDays} days`);
    console.log(
      `   Travelers: ${result.tour_info.number_of_persons} persons (${result.tour_info.travel_type})`
    );
    console.log(`   Transport: ${result.tour_info.mode_of_transport}`);
    console.log(`   Budget: ${result.tour_info.budgetType}\n`);

    // Display itinerary summary
    console.log("🗓️ Itinerary Summary:");
    console.log(`   Total activities: ${result.itinerary.length}`);

    // Group by type
    const typeCounts = result.itinerary.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} activities`);
    });

    // Group by date
    const dateGroups = result.itinerary.reduce((acc, item) => {
      const date = item.date.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    console.log("\n📅 Daily Breakdown:");
    Object.entries(dateGroups).forEach(([date, items]) => {
      console.log(`   ${date}: ${items.length} activities`);
      items.forEach((item) => {
        console.log(`     ${item.time} - ${item.type}: ${item.place_name}`);
      });
    });

    // Display cost breakdown
    console.log("\n💰 Cost Breakdown:");
    console.log(
      `   Accommodation: ${result.total_estimates.total_accommodation_cost} PKR`
    );
    console.log(`   Food: ${result.total_estimates.total_food_cost} PKR`);
    console.log(
      `   Transport: ${result.total_estimates.total_transport_cost} PKR`
    );
    console.log(`   Others: ${result.total_estimates.total_others} PKR`);
    console.log(
      `   Total: ${result.total_estimates.total_estimated_cost} PKR\n`
    );

    // Display tips
    if (result.notes_and_tips && result.notes_and_tips.length > 0) {
      console.log("💡 Travel Tips:");
      result.notes_and_tips.forEach((tip, index) => {
        console.log(`   ${index + 1}. ${tip.title}: ${tip.description}`);
      });
      console.log("");
    }

    // Display weather forecast
    if (result.weather_forecast) {
      console.log("🌤️ Weather Forecast:");
      console.log(`   ${result.weather_forecast.summary}`);
      console.log(`   Temperature: ${result.weather_forecast.temperature}`);
      console.log(`   Conditions: ${result.weather_forecast.conditions}\n`);
    }

    console.log("🎉 Test completed successfully!");
    return result;
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Error details:", error);
    throw error;
  }
};

// Run the test
testTourPlan().catch(console.error);

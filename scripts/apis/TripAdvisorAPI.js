// TripAdvisor API integration using Gemini API (free alternative)
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMENI_API_KEY;

export class TripAdvisorAPI {
  static async getLocalTips(destinationName, travelType, weather) {
    try {
      if (!GEMINI_API_KEY) {
        console.warn("Gemini API key not available for local tips");
        return this.getBasicTips(destinationName, travelType);
      }

      const prompt = `Provide local travel tips for ${destinationName} for ${travelType} travelers.

Return ONLY a JSON array with this exact structure:
[
  {
    "title": "string",
    "description": "string"
  }
]

Include 5-8 practical tips covering:
- Local customs and etiquette
- Best times to visit attractions
- Transportation tips
- Food and dining recommendations
- Safety tips
- Cultural insights
- Budget-friendly suggestions

Make tips specific to ${travelType} travelers and ${destinationName}.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn("Local tips API call failed, using basic tips");
        return this.getBasicTips(destinationName, travelType);
      }

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        console.warn("Invalid local tips API response");
        return this.getBasicTips(destinationName, travelType);
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      // Extract JSON from response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn("No tips JSON found in response");
        return this.getBasicTips(destinationName, travelType);
      }

      try {
        const tips = JSON.parse(jsonMatch[0]);
        console.log(
          `Generated ${tips.length} local tips for ${destinationName}`
        );
        return tips;
      } catch (parseError) {
        console.warn("Failed to parse tips JSON:", parseError);
        return this.getBasicTips(destinationName, travelType);
      }
    } catch (error) {
      console.error("Error fetching local tips:", error);
      // Return basic tips instead of throwing to avoid breaking the tour plan
      return this.getBasicTips(destinationName, travelType);
    }
  }

  static getBasicTips(destinationName, travelType) {
    return [
      {
        title: "General Travel Tips",
        description: `Enjoy your trip to ${destinationName}! Remember to respect local customs and stay safe.`,
      },
      {
        title: "Emergency Preparedness",
        description: "Keep emergency contacts handy and have travel insurance.",
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

  static async getRestaurantReviews(restaurantId) {
    try {
      if (!GEMINI_API_KEY) {
        return null;
      }

      const prompt = `Provide restaurant review data for a restaurant.

Return ONLY a JSON object with this exact structure:
{
  "rating": number (1-5),
  "reviewCount": number,
  "topReviews": ["review1", "review2", "review3"]
}

Make it realistic and positive.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        return null;
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      // Extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }

      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn("Failed to parse restaurant reviews JSON:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Error fetching restaurant reviews:", error);
      return null;
    }
  }

  static async getAttractionReviews(attractionId) {
    try {
      if (!GEMINI_API_KEY) {
        return null;
      }

      const prompt = `Provide attraction review data for a tourist attraction.

Return ONLY a JSON object with this exact structure:
{
  "rating": number (1-5),
  "reviewCount": number,
  "topReviews": ["review1", "review2", "review3"]
}

Make it realistic and positive.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        return null;
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      // Extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }

      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn("Failed to parse attraction reviews JSON:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Error fetching attraction reviews:", error);
      return null;
    }
  }
}
 
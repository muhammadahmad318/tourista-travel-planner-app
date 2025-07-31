// Weather API integration using Gemini API (free alternative)
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMENI_API_KEY;

export class WeatherAPI {
  static async getForecast(coordinates, startDate, endDate) {
    try {
      if (!GEMINI_API_KEY) {
        console.warn("Gemini API key not available for weather forecast");
        return [];
      }

      // Calculate number of days between start and end date
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      const prompt = `Provide a weather forecast for ${daysDiff} days starting from ${startDate} for coordinates ${coordinates.latitude}, ${coordinates.longitude}.

Return ONLY a JSON array with this exact structure:
[
  {
    "date": "YYYY-MM-DD",
    "temperature": number (in Celsius),
    "humidity": number (percentage),
    "condition": "Clear|Clouds|Rain|Snow|etc",
    "description": "string",
    "icon": "weather-icon-name",
    "recommendations": ["tip1", "tip2", "tip3"]
  }
]

Keep it realistic for the location and season. Include 3-5 practical travel tips per day.`;

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
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn(
          "Weather API call failed, continuing without weather data"
        );
        return [];
      }

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        console.warn("Invalid weather API response");
        return [];
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      // Extract JSON from response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn("No weather JSON found in response");
        return [];
      }

      try {
        const forecast = JSON.parse(jsonMatch[0]);
        console.log(`Generated weather forecast for ${forecast.length} days`);
        return forecast;
      } catch (parseError) {
        console.warn("Failed to parse weather JSON:", parseError);
        return [];
      }
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      // Return empty array instead of throwing to avoid breaking the tour plan
      return [];
    }
  }

  static async getCurrentWeather(coordinates) {
    try {
      if (!GEMINI_API_KEY) {
        return null;
      }

      const prompt = `Provide current weather for coordinates ${coordinates.latitude}, ${coordinates.longitude}.

Return ONLY a JSON object with this exact structure:
{
  "temperature": number (in Celsius),
  "humidity": number (percentage),
  "condition": "Clear|Clouds|Rain|Snow|etc",
  "description": "string",
  "icon": "weather-icon-name"
}`;

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
        console.warn("Failed to parse current weather JSON:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Error fetching current weather:", error);
      return null;
    }
  }
}

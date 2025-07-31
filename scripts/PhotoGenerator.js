export const GeneratePhoto = async (place) => {
  try {
    const accessKey = "k9bVxbl2XSq86mI91j-A2fOqyQJR9DxyHxAkpouC2GY";
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        place + "place"
      )}&client_id=${accessKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn(`No images found for place: ${place}`);
      return null;
    }

    const imageUrl = data.results[0]?.urls?.regular;

    if (!imageUrl) {
      console.warn(`No image URL found for place: ${place}`);
      return null;
    }

    return imageUrl;
  } catch (error) {
    console.error(`Error fetching photo for ${place}:`, error);
    return null;
  }
};

export async function geocodeAddress(address) {
  try {
    if (!address || typeof address !== "string") return null;

    const searchAddress = `${address}, Gauteng, South Africa`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchAddress
      )}&limit=1&countrycodes=za`,
      {
        headers: {
          "User-Agent": "RealEstatePlatform/1.0",
        },
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    console.warn("Address not found:", address);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
export async function geocodeProperties(properties) {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const geocodeWithDelay = async (property, index) => {
    await delay(index * 1000);
    const coords = await geocodeAddress(property.address);
    return coords ? { ...property, ...coords } : null;
  };

  const results = await Promise.all(properties.map(geocodeWithDelay));
  return results.filter(Boolean);
}

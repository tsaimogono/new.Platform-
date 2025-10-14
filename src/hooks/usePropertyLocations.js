import { useState, useEffect } from "react";
import { geocodeProperties } from "../lib/geocoding";

export function usePropertyLocations(properties) {
  const [locatedProperties, setLocatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function locateProperties() {
      try {
        setLoading(true);

        const propertiesWithCoords = properties.filter(
          (p) => p.coordinates?.lat && p.coordinates?.lng
        );
        const propertiesWithoutCoords = properties.filter(
          (p) => !p.coordinates?.lat || !p.coordinates?.lng
        );

        const newlyGeocoded = await geocodeProperties(propertiesWithoutCoords);

        setLocatedProperties([...propertiesWithCoords, ...newlyGeocoded]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (properties.length > 0) {
      locateProperties();
    }
  }, [properties]);

  return { locatedProperties, loading, error };
}

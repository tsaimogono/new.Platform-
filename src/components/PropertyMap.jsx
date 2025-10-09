"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";

const createCustomIcon = () => {
  if (typeof window === "undefined") return null;

  return L.divIcon({
    html: `<div style="background-color: #dc2626; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function PropertyMap({
  properties = [],
  height = "500px",
  className = "",
}) {
  const johannesburgCenter = [-26.1076, 28.0567];

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${className}`}>
      <MapContainer
        center={johannesburgCenter}
        zoom={12}
        style={{ height, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {properties.map((property) => {
          if (!property.latitude || !property.longitude) return null;

          return (
            <Marker
              key={property.id || property._id || property.title}
              position={[property.latitude, property.longitude]}
              icon={createCustomIcon()}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">
                    {property.title || "Untitled Property"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {property.address || "No address provided"}
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    R{property.price ? property.price.toLocaleString() : "N/A"}
                  </p>
                  {property.bedrooms && (
                    <p className="text-sm text-gray-500 mt-1">
                      {property.bedrooms} bed • {property.bathrooms || "?"} bath
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

PropertyMap.propTypes = {
  properties: PropTypes.array.isRequired,
  height: PropTypes.string,
  className: PropTypes.string,
};

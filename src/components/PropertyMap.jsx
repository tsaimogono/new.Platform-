"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PropertyMap({
  properties = [],
  height = "500px",
  className = "",
}) {
  const rustenburgCenter = [-25.667, 27.242]; // center map around properties

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${className}`}>
      <MapContainer
        center={rustenburgCenter}
        zoom={13}
        style={{ height, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {properties.map(
          (property) =>
            property.coordinates?.lat &&
            property.coordinates?.lng && (
              <Marker
                key={property.id || property._id}
                position={[property.coordinates.lat, property.coordinates.lng]}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <h3 className="font-bold text-lg mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {property.location}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      ${property.price?.toLocaleString() || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {property.size}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {property.description}
                    </p>
                    {property.amenities?.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Amenities: {property.amenities.join(", ")}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}

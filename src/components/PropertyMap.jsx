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

export default function PropertyMap({ properties = [], height = "500px" }) {
  const rustenburgCenter = [-25.667, 27.242];

  if (!properties || properties.length === 0) {
    return (
      <div
        style={{
          height,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f0f0",
        }}
      >
        Loading properties...
      </div>
    );
  }

  return (
    <MapContainer
      center={rustenburgCenter}
      zoom={13}
      style={{ height, width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {properties.map((p) => (
        <Marker key={p.id} position={[p.coordinates.lat, p.coordinates.lng]}>
          <Popup>
            <b>{p.title}</b>
            <br />
            {p.location}
            <br />${p.price?.toLocaleString()}
            <br />
            {p.bedrooms} bed • {p.bathrooms} bath
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

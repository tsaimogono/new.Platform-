"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
});

export default function TestMapPage() {
  const testProperties = [
    {
      id: 1,
      title: "James",
      location: "1254 Rustenburg",
      price: 1500,
      bedrooms: 5,
      bathrooms: 4,
      coordinates: { lat: -25.667, lng: 27.242 },
    },
    {
      id: 2,
      title: "Madiba",
      location: "66 Lome, Rustenburg",
      price: 5000,
      bedrooms: 4,
      bathrooms: 2,
      coordinates: { lat: -25.669, lng: 27.25 },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", fontSize: "24px" }}>
        🗺️ Test Map Integration
      </h1>
      <PropertyMap properties={testProperties} height="500px" />
    </div>
  );
}

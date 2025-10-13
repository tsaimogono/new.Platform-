"use client";
import PropertyMap from "@/components/PropertyMap";

export default function TestMap() {
  const testProperties = [
    {
      _id: "68d3bd320683fd9f1b8cfa7d",
      title: "Modern Family Home",
      location: "123 Main Street, Johannesburg, South Africa",
      coordinates: { lat: -26.1076, lng: 28.0567 },
      price: 2500000,
      bedrooms: 3,
      bathrooms: 2,
      description: "Beautiful modern family home in prime location",
      type: "house",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "red", fontSize: "24px" }}>
        TEST MAP WITH ORIGINAL PROPERTY DATA
      </h1>
      <p>Using the exact same property that was on the original page</p>

      <div style={{ margin: "20px 0", padding: "10px", background: "#f0f0f0" }}>
        <h3>Property Data:</h3>
        <pre>{JSON.stringify(testProperties[0], null, 2)}</pre>
      </div>

      <PropertyMap properties={testProperties} height="500px" />
    </div>
  );
}

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
});

export default function PropertyPage() {
  const sampleProperties = [
    {
      id: 1,
      title: "Luxury Apartment",
      location: "Sandton, Johannesburg",
      price: 2500000,
      coordinates: { lat: -26.1076, lng: 28.0567 },
      bedrooms: 3,
      bathrooms: 2,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Property Details</h1>
      <PropertyMap properties={sampleProperties} />
    </div>
  );
}

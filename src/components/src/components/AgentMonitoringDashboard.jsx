"use client";
import { useState, useEffect } from "react";
import PropertyMap from "./PropertyMap";

export default function AgentMonitoringDashboard() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(true);

  const mockAgents = [
    {
      id: 1,
      name: "John Smith",
      email: "john@propertyco.com",
      phone: "+27 123 456 789",
      currentLocation: {
        lat: -26.1076,
        lng: 28.0567,
      },
      currentActivity: "Property Viewing",
      currentProperty: "123 Main Street, Johannesburg",
      startTime: new Date().toISOString(),
      status: "active",
      performance: {
        listingsThisMonth: 12,
        salesThisMonth: 8,
        totalCommission: 125000,
        conversionRate: "67%",
        averageResponseTime: "15 min",
      },
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@propertyco.com",
      phone: "+27 987 654 321",
      currentLocation: {
        lat: -26.105,
        lng: 28.058,
      },
      currentActivity: "Client Meeting",
      currentProperty: "456 Oak Avenue, Sandton",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "active",
      performance: {
        listingsThisMonth: 8,
        salesThisMonth: 6,
        totalCommission: 98000,
        conversionRate: "75%",
        averageResponseTime: "12 min",
      },
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 1000);
  }, []);

  const activeAgents = agents.filter((agent) => agent.status === "active");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Agent Monitoring Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time tracking and performance metrics
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Active Agents</h3>
          <p className="text-3xl font-bold">{activeAgents.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Listings</h3>
          <p className="text-3xl font-bold">20</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-3xl font-bold">14</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Commission</h3>
          <p className="text-3xl font-bold">R223,000</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">
              Agents ({agents.length})
            </h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedAgent?.id === agent.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-gray-600">
                        {agent.currentActivity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {agent.currentProperty}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        agent.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">
              {selectedAgent
                ? `${selectedAgent.name}'s Location`
                : "Live Agent Locations"}
            </h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <PropertyMap
                properties={
                  selectedAgent
                    ? [
                        {
                          _id: selectedAgent.id,
                          title: selectedAgent.name,
                          location: selectedAgent.currentProperty,
                          coordinates: selectedAgent.currentLocation,
                          price: selectedAgent.performance.totalCommission,
                          bedrooms: selectedAgent.performance.salesThisMonth,
                          bathrooms: 0,
                        },
                      ]
                    : agents
                        .filter((a) => a.currentLocation)
                        .map((agent) => ({
                          _id: agent.id,
                          title: agent.name,
                          location: agent.currentProperty,
                          coordinates: agent.currentLocation,
                          price: agent.performance.totalCommission,
                          bedrooms: agent.performance.salesThisMonth,
                          bathrooms: 0,
                        }))
                }
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

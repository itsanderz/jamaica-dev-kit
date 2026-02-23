"use client";

import { useRef, useState, useCallback } from "react";
import Map from "@/components/Map";
import type { MapHandle } from "@/components/Map";
import SearchBar from "@/components/SearchBar";
import LocationCard from "@/components/LocationCard";
import ParishList from "@/components/ParishList";
import type { LocationResponse } from "@/lib/api";

export default function HomePage() {
  const mapRef = useRef<MapHandle>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /** Handle a location being selected (from map click or search) */
  const handleLocationSelect = useCallback(
    (location: LocationResponse) => {
      setSelectedLocation(location);
      setError(null);
      setSidebarOpen(true);

      // Fly map to the location and place marker
      mapRef.current?.flyTo(location.longitude, location.latitude, 15);
      mapRef.current?.setMarker(location.longitude, location.latitude);
    },
    []
  );

  /** Handle map click result (already has marker placed) */
  const handleMapLocationSelect = useCallback(
    (location: LocationResponse) => {
      setSelectedLocation(location);
      setError(null);
      setSidebarOpen(true);
    },
    []
  );

  /** Handle search error */
  const handleSearchError = useCallback((message: string) => {
    setError(message);
    setSelectedLocation(null);
  }, []);

  /** Handle parish selection from the list */
  const handleParishSelect = useCallback(
    (parish: { name: string; latitude: number; longitude: number }) => {
      mapRef.current?.flyTo(parish.longitude, parish.latitude, 11);
    },
    []
  );

  return (
    <div className="flex h-full relative">
      {/* ===== SIDEBAR (Desktop) ===== */}
      <aside
        className="hidden md:flex flex-col w-[380px] shrink-0 bg-white border-r border-gray-200
                      overflow-hidden z-20"
      >
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          {/* Search section */}
          <div className="p-4 border-b border-gray-100">
            <SearchBar
              onResult={handleLocationSelect}
              onError={handleSearchError}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-4 mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Selected location card */}
          {selectedLocation && (
            <div className="p-4 border-b border-gray-100">
              <LocationCard location={selectedLocation} />
            </div>
          )}

          {/* Welcome message (shown when no location is selected) */}
          {!selectedLocation && !error && (
            <div className="p-4 border-b border-gray-100">
              <div className="bg-jamaica-green/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-jamaica-gold/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-jamaica-gold"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Get Started
                  </h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Click anywhere on the map to generate a Plus Code address, or
                  search for a location using the search bar above.
                </p>
                <div className="mt-3 flex flex-col gap-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-jamaica-green" />
                    Click the map to get a Plus Code
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-jamaica-green" />
                    Search by address or Plus Code
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-jamaica-green" />
                    Select a parish to explore
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parish list */}
          <div className="p-4">
            <ParishList onParishSelect={handleParishSelect} />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 px-4 py-2">
          <p className="text-xs text-gray-400 text-center">
            Jamaica Digital Addressing System
          </p>
        </div>
      </aside>

      {/* ===== MAP ===== */}
      <div className="flex-1 relative">
        <Map ref={mapRef} onLocationSelect={handleMapLocationSelect} />

        {/* ===== MOBILE FLOATING PANEL ===== */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-20">
          {/* Search bar (always visible on mobile) */}
          <div className="px-3 pb-2">
            <SearchBar
              onResult={handleLocationSelect}
              onError={handleSearchError}
            />
          </div>

          {/* Expandable result card */}
          {(selectedLocation || error) && (
            <div
              className={`bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 ${
                sidebarOpen ? "max-h-[60vh]" : "max-h-16"
              } overflow-hidden`}
            >
              {/* Pull handle / collapse toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex flex-col items-center pt-2 pb-1 px-4"
              >
                <div className="w-10 h-1 rounded-full bg-gray-300 mb-2" />
                {!sidebarOpen && selectedLocation && (
                  <p className="text-sm font-bold plus-code text-jamaica-black">
                    {selectedLocation.plus_code}
                  </p>
                )}
              </button>

              {/* Card content */}
              <div className="overflow-y-auto max-h-[calc(60vh-3rem)] sidebar-scroll px-3 pb-4">
                {error && (
                  <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg mb-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {selectedLocation && (
                  <LocationCard location={selectedLocation} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile instruction tooltip (shown when nothing is selected) */}
        {!selectedLocation && (
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white rounded-lg px-4 py-2 text-xs pointer-events-none z-10 whitespace-nowrap">
            Tap the map to get a Plus Code
          </div>
        )}
      </div>
    </div>
  );
}

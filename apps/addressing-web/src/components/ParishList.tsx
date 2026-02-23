"use client";

import { useState } from "react";

/** All 14 Jamaican parishes with their capitals, populations, and center coordinates */
const PARISHES = [
  { name: "Kingston", capital: "Kingston", population: 89057, latitude: 17.9714, longitude: -76.7920 },
  { name: "St. Andrew", capital: "Half Way Tree", population: 573369, latitude: 18.0179, longitude: -76.7674 },
  { name: "St. Thomas", capital: "Morant Bay", population: 93902, latitude: 17.9814, longitude: -76.3800 },
  { name: "Portland", capital: "Port Antonio", population: 82183, latitude: 18.1750, longitude: -76.4500 },
  { name: "St. Mary", capital: "Port Maria", population: 113615, latitude: 18.3668, longitude: -76.8630 },
  { name: "St. Ann", capital: "St. Ann's Bay", population: 172362, latitude: 18.4373, longitude: -77.2006 },
  { name: "Trelawny", capital: "Falmouth", population: 75164, latitude: 18.4940, longitude: -77.6547 },
  { name: "St. James", capital: "Montego Bay", population: 184818, latitude: 18.4762, longitude: -77.8939 },
  { name: "Hanover", capital: "Lucea", population: 69533, latitude: 18.4500, longitude: -78.1600 },
  { name: "Westmoreland", capital: "Savanna-la-Mar", population: 144103, latitude: 18.2158, longitude: -78.1348 },
  { name: "St. Elizabeth", capital: "Black River", population: 150205, latitude: 18.0264, longitude: -77.8489 },
  { name: "Manchester", capital: "Mandeville", population: 190812, latitude: 18.0410, longitude: -77.5074 },
  { name: "Clarendon", capital: "May Pen", population: 245103, latitude: 17.9714, longitude: -77.2479 },
  { name: "St. Catherine", capital: "Spanish Town", population: 516218, latitude: 18.0124, longitude: -76.9545 },
];

interface ParishListProps {
  onParishSelect?: (parish: {
    name: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function ParishList({ onParishSelect }: ParishListProps) {
  const [expanded, setExpanded] = useState(false);

  const displayedParishes = expanded ? PARISHES : PARISHES.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Parishes of Jamaica
        </h3>
        <span className="text-xs text-gray-500">14 parishes</span>
      </div>

      {/* Parish grid */}
      <div className="space-y-1">
        {displayedParishes.map((parish) => (
          <button
            key={parish.name}
            onClick={() =>
              onParishSelect?.({
                name: parish.name,
                latitude: parish.latitude,
                longitude: parish.longitude,
              })
            }
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-jamaica-green/5
                       transition-colors group text-left"
          >
            {/* Parish indicator dot */}
            <div className="w-2 h-2 rounded-full bg-jamaica-green shrink-0 group-hover:scale-125 transition-transform" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-jamaica-green transition-colors">
                {parish.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {parish.capital} &middot;{" "}
                {parish.population.toLocaleString()} pop.
              </p>
            </div>

            {/* Arrow */}
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-jamaica-green transition-colors shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>

      {/* Show more / less toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-2 py-2 text-xs font-medium text-jamaica-green hover:text-jamaica-green/80
                   transition-colors flex items-center justify-center gap-1"
      >
        {expanded ? (
          <>
            Show less
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </>
        ) : (
          <>
            Show all 14 parishes
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

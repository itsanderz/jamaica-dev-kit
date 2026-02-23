"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { geocode, decode } from "@/lib/api";
import type { LocationResponse } from "@/lib/api";

interface SearchBarProps {
  onResult?: (location: LocationResponse) => void;
  onError?: (message: string) => void;
}

/**
 * Rough check if a string looks like a Plus Code.
 * Full Plus Codes are like "77CMHQHX+4R" or "HQHX+4R Kingston"
 */
function looksLikePlusCode(text: string): boolean {
  return /^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,}/i.test(
    text.replace(/\s.*/g, "")
  );
}

export default function SearchBar({ onResult, onError }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Execute search */
  const executeSearch = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setSearching(true);
      try {
        let result: LocationResponse;

        if (looksLikePlusCode(trimmed)) {
          result = await decode(trimmed);
        } else {
          result = await geocode(trimmed);
        }

        onResult?.(result);
      } catch (err) {
        console.error("Search error:", err);
        onError?.(
          err instanceof Error ? err.message : "Search failed. Please try again."
        );
      } finally {
        setSearching(false);
      }
    },
    [onResult, onError]
  );

  /** Handle input change with debounce */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Only auto-search for Plus Codes; full text needs explicit submit
      if (looksLikePlusCode(value.trim())) {
        debounceRef.current = setTimeout(() => {
          executeSearch(value);
        }, 300);
      }
    },
    [executeSearch]
  );

  /** Handle form submit */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      executeSearch(query);
    },
    [query, executeSearch]
  );

  /** Clean up timer on unmount */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search by address or Plus Code..."
          className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-jamaica-green/30 focus:border-jamaica-green
                     placeholder:text-gray-400 transition-all"
          aria-label="Search address or Plus Code"
        />

        {/* Submit / loading indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searching ? (
            <div className="w-5 h-5 border-2 border-jamaica-green border-t-transparent rounded-full animate-spin" />
          ) : (
            <button
              type="submit"
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-jamaica-green"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

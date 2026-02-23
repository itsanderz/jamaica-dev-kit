"use client";

import { useState, useCallback } from "react";
import type { LocationResponse } from "@/lib/api";

interface LocationCardProps {
  location: LocationResponse;
}

export default function LocationCard({ location }: LocationCardProps) {
  const [copied, setCopied] = useState<"code" | "share" | null>(null);

  const copyToClipboard = useCallback(
    async (text: string, type: "code" | "share") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      }
    },
    []
  );

  const handleCopyCode = useCallback(() => {
    copyToClipboard(location.plus_code, "code");
  }, [location.plus_code, copyToClipboard]);

  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}?code=${encodeURIComponent(location.plus_code)}`;
    copyToClipboard(shareUrl, "share");
  }, [location.plus_code, copyToClipboard]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Plus Code header */}
      <div className="bg-jamaica-green/5 border-b border-jamaica-green/10 px-4 py-3">
        <p className="text-xs font-medium text-jamaica-green uppercase tracking-wider mb-1">
          Plus Code Address
        </p>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleCopyCode}
            className="plus-code text-xl font-bold text-jamaica-black hover:text-jamaica-green transition-colors text-left"
            title="Click to copy Plus Code"
          >
            {location.plus_code}
          </button>
          <button
            onClick={handleCopyCode}
            className="shrink-0 p-2 rounded-lg hover:bg-jamaica-green/10 transition-colors group"
            title="Copy Plus Code"
          >
            {copied === "code" ? (
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
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-jamaica-green"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Location details */}
      <div className="px-4 py-3 space-y-2">
        {/* Parish */}
        {location.parish && (
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-jamaica-gold mt-0.5 shrink-0"
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
            <div>
              <p className="text-xs text-gray-500">Parish</p>
              <p className="text-sm font-medium text-gray-900">
                {location.parish}
              </p>
            </div>
          </div>
        )}

        {/* Formatted address */}
        {location.formatted_address && (
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm text-gray-700">
                {location.formatted_address}
              </p>
            </div>
          </div>
        )}

        {/* Coordinates */}
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <div>
            <p className="text-xs text-gray-500">Coordinates</p>
            <p className="text-sm text-gray-700 font-mono">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={handleCopyCode}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-jamaica-green text-white
                     text-sm font-medium rounded-lg hover:bg-jamaica-green/90 transition-colors"
        >
          {copied === "code" ? (
            <>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy Code
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200
                     text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied === "share" ? (
            <>
              <svg
                className="w-4 h-4 text-jamaica-green"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Link Copied!
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16,6 12,2 8,6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              Share
            </>
          )}
        </button>
      </div>
    </div>
  );
}

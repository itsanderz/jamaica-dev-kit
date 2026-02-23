"use client";

import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jamaica-green flex items-center justify-center mr-2 mt-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-4 h-4"
        >
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 20.97V18.35a47.72 47.72 0 0 1-1.087-.128C2.905 17.975 1.5 16.33 1.5 14.436V6.385c0-1.866 1.369-3.477 3.413-3.727ZM19.5 9.222c-1.966-.164-3.965-.248-5.988-.248-2.023 0-4.022.084-5.988.248C5.744 9.397 4.5 10.989 4.5 12.693v4.286c0 1.704 1.244 3.296 3.024 3.47.577.058 1.157.108 1.74.149.679.048 1.236.67 1.236 1.351v1.52a.75.75 0 0 0 1.28.531l2.647-2.647a.75.75 0 0 1 .53-.22h1.056c2.023 0 4.022-.084 5.988-.248 1.78-.175 3.024-1.767 3.024-3.47v-4.287c0-1.704-1.244-3.296-3.024-3.47Z" />
        </svg>
      </div>

      {/* Typing bubble */}
      <div className="bg-jamaica-gray rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
        </div>
      </div>
    </div>
  );
}

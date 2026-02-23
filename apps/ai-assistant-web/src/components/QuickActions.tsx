"use client";

import React from "react";

interface QuickActionsProps {
  onAction: (text: string) => void;
  disabled?: boolean;
}

const QUICK_ACTIONS = [
  { label: "Passport Fees", text: "What are the current passport fees in Jamaica?" },
  { label: "Register a Business", text: "How do I register a business in Jamaica?" },
  { label: "Get a TRN", text: "How do I get a TRN (Taxpayer Registration Number)?" },
  { label: "Driver's Licence", text: "How do I get a driver's licence in Jamaica?" },
  { label: "Birth Certificate", text: "How do I get a birth certificate in Jamaica?" },
];

export default function QuickActions({ onAction, disabled }: QuickActionsProps) {
  return (
    <div className="quick-actions-scroll flex gap-2 overflow-x-auto px-4 py-2">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          onClick={() => onAction(action.text)}
          disabled={disabled}
          className="flex-shrink-0 bg-jamaica-gold text-jamaica-black text-xs font-medium
                     px-3.5 py-1.5 rounded-full hover:bg-yellow-400
                     active:bg-yellow-500 transition-colors duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm whitespace-nowrap"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

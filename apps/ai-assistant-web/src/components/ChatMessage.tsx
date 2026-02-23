"use client";

import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

/**
 * Renders simple markdown: **bold**, *italic*, [links](url),
 * unordered lists (lines starting with - or *), ordered lists,
 * and inline `code`.
 */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let orderedListItems: React.ReactNode[] = [];
  let listKey = 0;

  const flushUnordered = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${listKey++}`}>{listItems}</ul>);
      listItems = [];
    }
  };

  const flushOrdered = () => {
    if (orderedListItems.length > 0) {
      elements.push(<ol key={`ol-${listKey++}`}>{orderedListItems}</ol>);
      orderedListItems = [];
    }
  };

  const formatInline = (line: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Match bold, italic, inline code, and links
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // Bold
        parts.push(<strong key={match.index}>{match[2]}</strong>);
      } else if (match[3]) {
        // Italic
        parts.push(<em key={match.index}>{match[3]}</em>);
      } else if (match[4]) {
        // Inline code
        parts.push(<code key={match.index}>{match[4]}</code>);
      } else if (match[5] && match[6]) {
        // Link
        parts.push(
          <a
            key={match.index}
            href={match[6]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {match[5]}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [line];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unorderedMatch = line.match(/^\s*[-*]\s+(.+)/);
    const orderedMatch = line.match(/^\s*\d+[.)]\s+(.+)/);

    if (unorderedMatch) {
      flushOrdered();
      listItems.push(
        <li key={`li-${i}`}>{formatInline(unorderedMatch[1])}</li>
      );
    } else if (orderedMatch) {
      flushUnordered();
      orderedListItems.push(
        <li key={`li-${i}`}>{formatInline(orderedMatch[1])}</li>
      );
    } else {
      flushUnordered();
      flushOrdered();
      if (line.trim() === "") {
        elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(<p key={`p-${i}`}>{formatInline(line)}</p>);
      }
    }
  }

  flushUnordered();
  flushOrdered();

  return elements;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar for assistant */}
      {!isUser && (
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
      )}

      <div
        className={`max-w-[80%] sm:max-w-[70%] ${
          isUser
            ? "bg-jamaica-green text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
            : "bg-jamaica-gray text-gray-900 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
        } px-4 py-2.5 shadow-sm`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        ) : (
          <div className="markdown-content text-sm leading-relaxed">
            {renderMarkdown(content)}
          </div>
        )}

        {timestamp && (
          <p
            className={`text-[10px] mt-1 ${
              isUser ? "text-white/60" : "text-gray-400"
            } text-right`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

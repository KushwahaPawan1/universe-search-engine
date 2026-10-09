
import React from "react";

export default function ResultCard({ title, url, content, type }) {
  // fallback for missing title/url/content
  const displayTitle = title || "Untitled";
  const displayUrl = url || "#";
  const displayContent = content || "No description available.";

  return (
    <div className="mb-6">
      {/* URL */}
      {displayUrl !== "#" && (
        <p className="text-sm text-green-700 mb-1 break-all">{displayUrl}</p>
      )}

      {/* Title */}
      <a
        href={displayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg sm:text-xl text-blue-800 font-medium hover:underline line-clamp-2 break-words"
      >
        {displayTitle}
      </a>

      {/* Description */}
      {type !== "maps" && (
        <p className="text-gray-700 mt-1 text-sm sm:text-base line-clamp-3">
          {displayContent}
        </p>
      )}

      <hr className="mt-4 border-gray-300" />
    </div>
  );
}

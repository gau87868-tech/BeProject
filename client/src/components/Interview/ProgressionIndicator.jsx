// src/components/ProgressionIndicator.jsx
import React from "react";

export default function ProgressionIndicator({ total, current }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="text-sm text-gray-600 mb-2">{current}/{total}</div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div className="h-2 bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

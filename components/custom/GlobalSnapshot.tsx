import React from "react";
import { LuGlobe } from "react-icons/lu";

const GlobalSnapshot = () => {
  return (
    <div className="mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-3">
        <LuGlobe size={"12px"} />
        <h3 className="text-sm font-medium text-gray-900">Global Snapshot</h3>
      </div>
      <div className="text-xs text-gray-500 leading-relaxed">
        FAO: Global catch stable at 90.3 MT
      </div>
      <div className="text-xs text-gray-500 leading-relaxed">
        Euronext Salmon: $7.50/kg (Sept futures)
      </div>
    </div>
  );
};

export default GlobalSnapshot;

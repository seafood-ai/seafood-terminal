import React from "react";
import { LuFish } from "react-icons/lu";

const QuotaUsage = () => {
  return (
    <div className="border-1 p-3 rounded-md shadow-sm bg-white">
      <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-1">
        <LuFish />
        Quota Usage
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Alaska Crab: 78% used</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Halibut IFQ: 62% used</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Salmon Cook Inlet: 42% used</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaUsage;

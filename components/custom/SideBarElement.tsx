"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface SbElementProps {
  title: string;
  bgColor: string;
  textColor: string;
  showArrow?: boolean;
}

const SideBarElement: React.FC<SbElementProps> = ({
  title,
  bgColor,
  textColor,
  showArrow,
}) => {
  const [sideToggle, setSideToggle] = useState(true);
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-l-2 ml-4 pl-1`}
      style={{
        backgroundColor: bgColor,
        borderColor: textColor,
        color: textColor,
      }}
      onClick={() => setSideToggle(!sideToggle)}
    >
      <div className="flex items-center space-x-0">
        <div className="w-7 h-7">
          {showArrow ? (
            sideToggle ? (
              <ChevronRight size={28} />
            ) : (
              <ChevronDown size={28} />
            )
          ) : null}
        </div>
        <span className={` font-medium`}>{title}</span>
      </div>
    </div>
  );
};

export default SideBarElement;

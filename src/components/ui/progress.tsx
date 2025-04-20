import React from "react";

interface ProgressProps {
  value: number; // Valor entre 0 e 100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
      <div
        className="bg-blue-500 h-4 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
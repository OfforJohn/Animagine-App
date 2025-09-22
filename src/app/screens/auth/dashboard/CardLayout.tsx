// CardLayout.tsx
import React from "react";

interface CardLayoutProps {
  title: string;
  children: React.ReactNode;
}

const CardLayout: React.FC<CardLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      
      <div className="w-80 sm:w-[500px] md:w-[700px] lg:w-[900px] h-[600px] border rounded-lg shadow-md flex flex-col border-2 border-black justify-between p-6 bg-grey">

        {/* Title */}
        <h1 className="text-xl font-semibold text-center">{title}</h1>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default CardLayout;

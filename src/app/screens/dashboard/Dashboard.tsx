"use client";
import { User } from "firebase/auth";

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-80 h-[500px] border rounded-lg shadow-md flex flex-col justify-between p-6 bg-white">
        {/* Title */}
        <h1 className="text-xl font-semibold text-center">Animagine</h1>

        {/* Spacer for center alignment */}
        <div className="flex-1" />

        {/* Button */}
        <button className="border px-4 py-2 rounded-md hover:bg-gray-100 transition">
          Create Character
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

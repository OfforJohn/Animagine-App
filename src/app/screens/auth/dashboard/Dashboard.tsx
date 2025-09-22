import React from "react";
import CardLayout from "./CardLayout";
import { User } from "firebase/auth";

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <CardLayout title="Animagine">
      <div className="flex justify-center mb-8">
        <button className="border-2 border-black text-black font-bold px-6 py-2 rounded-md">
          Create Charactery
        </button>
      </div>
    </CardLayout>
  );
};

export default Dashboard;

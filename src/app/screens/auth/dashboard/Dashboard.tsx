import React from "react";
import CardLayout from "./CardLayout";
import { User, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase"; // ✅ make sure you have your auth export
import { toast } from "react-toastify";

interface DashboardProps {
  user: User | null;
  setUser: (user: User | null) => void; // ✅ allow updating user on logout
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("You have been logged out.");
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <CardLayout title="Animagine">
      <div className="flex flex-col items-center gap-6 mb-8">
        <button className="border-2 border-black text-black font-bold px-6 py-2 rounded-md">
          Create Character
        </button>

        <button
          onClick={handleLogout}
          className="border-2 border-red-500 text-red-600 font-bold px-6 py-2 rounded-md hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </CardLayout>
  );
};

export default Dashboard;

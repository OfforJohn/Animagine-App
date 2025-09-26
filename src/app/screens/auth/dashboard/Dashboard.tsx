"use client";
import React from "react";
import CardLayout from "./CardLayout";
import { User, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface DashboardProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("👋 Logged out successfully!");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("❌ Logout failed. Try again.");
    }
  };

  const handleCreateCharacter = () => {
    router.push("/screens/animation");
  };

  return (
  <CardLayout title="Animagine">
  <div className="flex flex-col items-center text-center px-4 pt-6 pb-10 sm:pb-16 w-full max-w-2xl mx-auto">
    {/* 🪄 Welcome Text */}
    <div className="mb-8 sm:mb-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 animate-pulse mb-2">
        🎬 Welcome, Creator!
      </h1>
      <p className="text-gray-600 text-lg max-w-xl mx-auto">
        Build your own animated world — one character at a time.
      </p>
    </div>

    {/* 💡 Prompt Suggestions */}
    <div className="text-sm text-gray-500 mb-12 sm:mb-20">
      <p className="font-medium">Need inspiration?</p>
      <ul className="mt-2 space-y-1">
        <li>⚔️ A futuristic warrior with neon armor</li>
        <li>🧙‍♂️ A wizard with glowing eyes and a crow on his shoulder</li>
        <li>🐉 A tiny dragon that wears a backpack</li>
      </ul>
    </div>

    {/* ✨ Action Buttons (Always inside and side-by-side) */}
    <div className="w-full max-w-md mx-auto px-4">
      <div className="flex gap-3">
        <button
          onClick={handleCreateCharacter}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-md text-sm sm:text-base shadow-md hover:scale-105 transition-transform"
        >
          ✨ Create Character
        </button>

        <button
          onClick={handleLogout}
          className="flex-1 border border-red-500 text-red-600 px-4 py-3 rounded-md text-sm sm:text-base hover:bg-red-50 transition"
        >
          🔒 Logout
        </button>
      </div>
    </div>
  </div>
</CardLayout>

  );
};

export default Dashboard;

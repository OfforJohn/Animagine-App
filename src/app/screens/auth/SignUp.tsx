"use client";
import { useState } from "react";
import { signUp } from "@/firebase/auth";
import { User } from "firebase/auth"; // Import Firebase User type

interface SignUpProps {
  setError: (message: string) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void; // Set the correct type for user
}

const SignUp: React.FC<SignUpProps> = ({ setError, setLoading, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const newUser = await signUp(email, password);
      setUser(newUser ?? null); // Set the user in parent component, default to null if undefined
      console.log(newUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error signing up. Please try again.";
      setError(errorMessage);
      console.error("Error signing up:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="p-4 border border-gray-300 rounded-lg shadow-sm w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="p-4 border border-gray-300 rounded-lg shadow-sm w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
      />
      <button
        onClick={handleSignUp}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full text-lg transition-colors duration-300 hover:bg-blue-600"
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;

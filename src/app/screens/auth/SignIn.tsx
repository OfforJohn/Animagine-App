"use client";
import { useState } from "react";
import { signIn } from "@/firebase/auth";

interface SignInProps {
  setError: (message: string) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: any) => void;
}

const SignIn: React.FC<SignInProps> = ({ setError, setLoading, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const loggedInUser = await signIn(email, password);
      setUser(loggedInUser); // Set the user in parent component
      console.log(loggedInUser);
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Error signing in:", err);
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
        onClick={handleSignIn}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full text-lg transition-colors duration-300 hover:bg-blue-600"
      >
        Sign In
      </button>
    </div>
  );
};

export default SignIn;

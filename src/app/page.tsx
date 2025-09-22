"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth"; // Firebase auth state listener
import { auth } from "../firebase/firebase"; // Import firebase auth
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp"; // Import SignUp component
import Dashboard from "./screens/auth/dashboard/Dashboard"; // Import Dashboard component
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState<User | null>(null); // Store the current user
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between SignUp and SignIn

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user if authenticated
      } else {
        setUser(null); // Set to null if not authenticated
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-50">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-md w-full">
       

        {loading ? (
          <p>Loading...</p> // Show loading spinner or text when loading
        ) : (
          <>
            {user ? (
              // If the user is signed in, show the dashboard
              <Dashboard user={user} />
            ) : (
              // If not signed in, show SignUp / SignIn form
              <>
                {isSignUp ? (
                  <SignUp setError={setError} setLoading={setLoading} setUser={setUser} />
                ) : (
                  <SignIn setError={setError} setLoading={setLoading} setUser={setUser} />
                )}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <p className="mt-4">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsSignUp(false)}
                        className="text-blue-500 hover:underline"
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={() => setIsSignUp(true)}
                        className="text-blue-500 hover:underline"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </p>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth"; // Firebase auth state listener
import { auth } from "../firebase/firebase"; // Import firebase auth
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp"; // Import SignUp component
import Dashboard from "./screens/auth/dashboard/Dashboard";
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
    <div className="font-sans min-h-screen flex items-center justify-center bg-gray-50 p-1">
       

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
                     
                   
                    </>
                  )}
                </p>
              </>
            )}
          </>
        )}
   
    </div>
  );
}

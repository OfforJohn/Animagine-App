"use client";
import { useState } from "react";
import { signIn, signUp } from "@/firebase/auth";
import { toast } from "react-toastify";
import { getFirebaseErrorMessage } from "./utils/firebaseErrors";
import { User } from "firebase/auth"; // ✅ Import Firebase User type
import { resetPassword } from "@/firebase/firebase";

interface SignInProps {
  setError: (message: string) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void; // ✅ Strong type
}

const SignIn: React.FC<SignInProps> = ({ setError, setLoading, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loggedInUser = await signIn(email, password);

      if (loggedInUser) {
        setUser(loggedInUser ?? null);
        toast.success("Welcome back!");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err: unknown) {
      // ✅ use `unknown` instead of `any`
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? (err as { code: string }).code
          : "unknown";

      toast.error(getFirebaseErrorMessage(code));
      console.error("Error signing in:", err);
    } finally {
      setLoading(false);
    }
  };

const handleForgotPassword = async () => {
  if (!email) {
    toast.error("Please enter your email first.");
    return;
  }

  try {
    const res = await fetch("/api/send-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Password reset email sent! Check your inbox.");
    } else {
      toast.error(data.error || "Something went wrong.");
    }
  } catch (err) {
    toast.error("Error sending reset email.");
    console.error(err);
  }
};


  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newUser = await signUp(email, password);
      setUser(newUser ?? null);
      toast.success("Account created successfully!");
    } catch (err: unknown) {
      // ✅ use `unknown` instead of `any`
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? (err as { code: string }).code
          : "unknown";

      toast.error(getFirebaseErrorMessage(code));
      console.error("Error signing up:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-80 sm:w-[500px] md:w-[700px] lg:w-[500px] h-[600px] border-2 border-black rounded-lg shadow-md flex flex-col justify-between p-6 bg-grey">
        <h1 className="text-xl font-semibold text-center">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>

        <div className="flex-1 flex flex-col justify-center">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
{!isSignUp && (
  <button
    type="button"
    onClick={handleForgotPassword}
    className="text-sm text-black hover:underline mb-3 text-left"
  >
    Forgot password?
  </button>
)}


          <button
            onClick={isSignUp ? handleSignUp : handleSignIn}
            className="w-full border border-black rounded-md py-2 font-medium bg-gray-100 hover:bg-gray-200 transition mb-3"
          >
            {isSignUp ? "Sign Up" : "Continue"}
          </button>

          <p className="text-center text-sm">
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
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-500 hover:underline"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

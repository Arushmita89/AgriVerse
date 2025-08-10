import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-green-400 px-4">
      {/* AgriVerse */}
      <Link to="/" className="flex items-center gap-2 border-green-900 mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold">
          <img
            src="logo.jpg"
            alt="logo"
            className="w-full h-full justify-center object-center border border-green-900 rounded-full object-fill"
          />
        </div>
        <span className="font-bold text-[3rem] border-1 text-green-900 font-dm-serif">
          AgriVerse
        </span>
      </Link>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center drop-shadow-md">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-5 py-3 rounded-lg text-center font-semibold shadow-inner shadow-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-5 py-3 rounded-lg text-center font-semibold animate-fadeIn shadow-inner shadow-green-300">
              {success}
            </div>
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-green-400 rounded-xl px-5 py-3 text-gray-700 placeholder-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-600 transition"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-green-400 rounded-xl px-5 py-3 text-gray-700 placeholder-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-600 transition"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-extrabold text-lg tracking-wide shadow-lg shadow-green-400/40 transition-transform hover:scale-[1.03]"
          >
            Sign Up
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SignUpPage;

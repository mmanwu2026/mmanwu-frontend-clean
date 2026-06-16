"use client";

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Signup successful! Check your email to confirm your account.");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Sign up</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-80">
        <div>
          <label className="block mb-1">Your Name</label>
          <input
            type="text"
            className="w-full p-2 rounded text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 underline">
          Log in
        </a>
      </p>
    </div>
  );
}

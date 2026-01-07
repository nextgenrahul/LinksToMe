// src/features/auth/pages/SignupPage.tsx
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

export default function SignupPage() {
  const {
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignup();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm rounded-xl bg-zinc-900 p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-200">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
          />

          <button className="w-full bg-blue-600 py-2 rounded">
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

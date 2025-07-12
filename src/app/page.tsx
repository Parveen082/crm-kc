"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://keshvacredit.com/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminMail: username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const role = data.role?.toLowerCase();
        const token = data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "superadmin") router.push("/superadmin");
        else if (role === "member") router.push("/member");
        else if (role === "agent") router.push("/agent");
        else toast.error("Unknown role: " + role);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700">CRM Login</h1>

        <div className="space-y-2">
          <input
            type="text"
            className="w-full text-black border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <input
            type="password"
            className="text-black w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <hr className="h-1 bg-black border-none" />

        <p className="text-xs text-gray-500 text-center pt-2">
          © {new Date().getFullYear()} KeshvaCredit. All rights reserved.
        </p>
      </form>
    </main>
  );
}

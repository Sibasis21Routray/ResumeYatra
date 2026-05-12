import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/apiClient";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter valid email");
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.forgotPassword(email);
      toast.success(res.data.message || "Reset link sent to your email 📩");
      setEmail("");
    } catch (err: any) {
      // Global interceptor already toasts the error message, 
      // but we can catch it here if we need to do specific logic per-page.
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-1">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#01467d] text-white rounded-lg font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
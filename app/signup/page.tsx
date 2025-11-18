"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignupPayload } from "@/types/type";
import { signupUser } from "@/services/auth";

export default function SignUp() {
  const router = useRouter();

  const [form, setForm] = useState<SignupPayload>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signupUser(form);
      setSuccess("Account created. Redirecting to login...");
      setTimeout(() => router.push("/login"), 900);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen grid grid-cols-2">
      {/* LEFT IMAGE */}
      <div className="relative w-[606px] h-[840px]">
        <Image
          src="/images/signUp_image.png"
          alt="Auth Visual"
          fill
          className="object-scale-down"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-start justify-center pt-[168px]">
        <div className="w-[448px] space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-center">Create your account</h1>
            <p className="text-gray-600 text-center">Start managing your tasks efficiently</p>
          </div>

          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First + Last name side by side */}
            <div className="flex gap-4">
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First name"
                required
                className="w-1/2 border p-3 rounded"
              />

              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Last name"
                required
                className="w-1/2 border p-3 rounded"
              />
            </div>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border p-3 rounded"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border p-3 rounded"
            />

            <input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              className="w-full border p-3 rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded"
            >
              {loading ? "Creating..." : "Sign up"}
            </button>
          </form>

          {/* Added back */}
          <p className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

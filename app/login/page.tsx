"use client";

import React, { useState } from "react";
import { loginUser, saveTokens } from "@/services/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormState = {
  email: string;
  password: string;
};

export default function LogIn() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tokens = await loginUser(form.email, form.password);

      if (remember) {
        saveTokens(tokens); // persistent
      } else {
        sessionStorage.setItem("access", tokens.access);
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen grid grid-cols-2">
      {/* LEFT IMAGE */}
      <div className="relative w-[606px] h-[840px]">
        <Image
          src="/images/logIn_image.png"
          alt="Auth Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex justify-center items-start pt-[232px]">
        <div className="w-[448px] space-y-9">
          <div>
            <h2 className="text-3xl font-semibold text-center">Log in to your account</h2>
            <p className="text-gray-600 text-center">Start managing your tasks efficiently</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full border px-3 py-3 rounded"
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full border px-3 py-3 rounded"
              />

              {/* Remember me */}
              <label className="flex items-center gap-2 mt-3 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-600 underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

"use client";

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

    // basic client-side validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const result = await signupUser(form);
      setSuccess("Account created. Redirecting to login...");
      // wait briefly so user sees success
      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>

      {error && <div className="mb-2 text-red-600">{error}</div>}
      {success && <div className="mb-2 text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password (min 6 chars)"
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </main>
  );
}

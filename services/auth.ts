"use client";

import { LoginResponse, SignupPayload, SignupResponse } from "@/types/type";
import { useRouter } from "next/router";
import { useEffect } from "react";
/// sign up
export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  const form = new FormData();
  form.append("first_name", payload.first_name);
  form.append("last_name", payload.last_name);
  form.append("email", payload.email);
  form.append("password", payload.password);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/signup/`, {
    method: "POST",
    body: form, // browser sets the Content-Type boundary automatically
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // backend returns 400 with detail/messages — bubble up useful info
    const errMsg = data?.detail || JSON.stringify(data) || res.statusText;
    throw new Error(errMsg);
  }

  return data as SignupResponse;
}


/// login
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  // API expects form-data. Create FormData and send it.
  const form = new FormData();
  form.append("email", email);
  form.append("password", password);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    body: form,
    // fetch will set correct multipart/form-data boundary header
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || res.statusText || "Login failed");
  }

  const data = await res.json();
  return data as LoginResponse;
}

export function saveTokens({ access, refresh }: LoginResponse) {
  // Simple approach: store in localStorage
  // Note: for production prefer httpOnly cookie for refresh token
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}


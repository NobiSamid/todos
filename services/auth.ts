"use client";

import { LoginResponse, SignupPayload, SignupResponse, UpdateProfilePayload } from "@/types/type";
import api from "./api";


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

export async function updateProfile(payload: UpdateProfilePayload) {
  // Build FormData
  const fd = new FormData();
  if (payload.first_name !== undefined) fd.append("first_name", payload.first_name);
  if (payload.last_name !== undefined) fd.append("last_name", payload.last_name);
  if (payload.address !== undefined) fd.append("address", payload.address);
  if (payload.contact_number !== undefined) fd.append("contact_number", payload.contact_number);
  if (payload.birthday !== undefined) fd.append("birthday", payload.birthday);
  if (payload.bio !== undefined) fd.append("bio", payload.bio);
  if (payload.profile_image) fd.append("profile_image", payload.profile_image);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // IMPORTANT: do NOT set Content-Type here; browser will set multipart boundary
  const res = await api.patch("/api/users/me/", fd, {
    headers,
  });
  return res.data; // the updated user object (as per your Postman response)
}

export async function getProfile() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await api.get("/api/users/me/", { headers });
  return res.data;
}

export async function changePassword(old_password: string, new_password: string) {
  const fd = new FormData();
  fd.append("old_password", old_password);
  fd.append("new_password", new_password);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Important: do NOT set Content-Type manually
  const res = await api.post("/api/users/change-password/", fd, { headers });
  return res.data; // { detail: "Password updated successfully." }
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


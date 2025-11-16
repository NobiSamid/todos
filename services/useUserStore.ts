import {create} from "zustand";
import {toast} from "react-hot-toast";
import { api } from './api';
import { SignupPayload, SignupResponse } from "@/types/type";


export async function signupWithAxios(payload: SignupPayload): Promise<SignupResponse> {
  const form = new FormData();
  form.append("first_name", payload.first_name);
  form.append("last_name", payload.last_name);
  form.append("email", payload.email);
  form.append("password", payload.password);

  const res = await api.post<SignupResponse>("/api/users/signup/", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}


export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return console.log(res.json()); // { access, refresh }
}
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem("access_token");

    if (!access) {
      router.replace("/login");
    }
  }, [router]);
}


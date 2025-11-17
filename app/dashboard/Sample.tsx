"use client";

import useAuth from "@/hooks/useAuth";
import { clearTokens } from "@/services/auth";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import AccountInfo from "./comp/AccountInfo";
import { useRouter } from "next/navigation";


const TodoList = dynamic(() => import("./comp/TodoList"), { ssr: false });


export default function Sample() {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"todo" | "account">("todo");
  
  useAuth()
  
  function logout() {
    clearTokens();
    router.push("/login");
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen w-full">

      {/* LEFT SIDEBAR */}
      <aside className="w-1/4 bg-[royalblue] text-white p-6 flex flex-col justify-between">

        {/* TOP PART */}
        <div>
          {/* Profile */}
          <div className="flex flex-col items-center">
            <img
              alt="Profile"
              className="rounded-full w-24 h-24 border-2 border-white"
            />
            <h2 className="text-xl font-semibold mt-4">Your Name</h2>
            <p className="text-sm text-gray-200">your@email.com</p>
          </div>

          {/* Dashboard Label */}
          <h3 className="text-lg font-bold mt-10 mb-4">Dashboard</h3>

          {/* Menu */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab("todo")}
              className={`text-left p-2 rounded 
                ${activeTab === "todo" ? "bg-white text-blue-700" : "hover:bg-blue-500"}
              `}
            >
              Todo
            </button>

            <button
              onClick={() => setActiveTab("account")}
              className={`text-left p-2 rounded 
                ${activeTab === "account" ? "bg-white text-blue-700" : "hover:bg-blue-500"}
              `}
            >
              Account Info
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={()=> logout()} className="bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-6">
          Log Out
        </button>

      </aside>

      {/* RIGHT MAIN AREA */}
      <main className="w-3/4 bg-gray-100 p-8 overflow-y-auto">

        {/* NAVBAR (NAME + DATE) */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Your Name</h1>
          <p className="text-gray-600">{today}</p>
        </div>

        {/* MAIN CONTENT */}
        <div>
          {activeTab === "todo" ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Todo List</h2>
              {/* TODO CONTENT HERE */}
              <TodoList initialFilterCompleted={true} />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              {/* ACCOUNT INFO HERE */}
              <p className="text-gray-600">Your account details will appear here.</p>
              <AccountInfo />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

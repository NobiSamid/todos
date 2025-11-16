"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import AccountInfo from './comp/AccountInfo';
import dynamic from "next/dynamic";

const TodoList = dynamic(() => import("./comp/TodoList"), { ssr: false });

const tabs = [
	{ id: "AccountInfo", label: "Account Info" },
	{ id: "TodoList", label: "Todo List" },
];


function Dashboard() {
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("TodoList");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/");
    }
  }, [router]);


  return (
    <div className="flex w-full overflow-hidden">
    <div className='relative z-10 container mx-auto px-4 py-16'>
				<h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
				>
					Admin Dashboard
				</h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				{activeTab === "AccountInfo" && <AccountInfo />}
				{activeTab === "TodoList" && <TodoList initialFilterCompleted={true} />}
			</div>
    </div>
  );
}

export default Dashboard;
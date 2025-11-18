"use client";

import useAuth from "@/hooks/useAuth";
import { clearTokens, getProfile } from "@/services/auth";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import AccountInfo from "./comp/AccountInfo";
import { useRouter } from "next/navigation";
import UserInfoModal from "@/components/UserInfoModal";


const TodoList = dynamic(() => import("./comp/TodoList"), { ssr: false });


export default function Sample() {

	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"todo" | "account">("todo");
	const [user, setUser] = useState<any | null>(null);

	const [loadingUser, setLoadingUser] = useState<boolean>(true);
	const [userError, setUserError] = useState<string | null>(null);

	const [showInfoModal, setShowInfoModal] = useState(false);
	const [infoLoading, setInfoLoading] = useState(false);
	const [infoError, setInfoError] = useState<string | null>(null);
	const [infoUser, setInfoUser] = useState<any | null>(null);

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


	// for account info
	useEffect(() => {
		let mounted = true;
		setLoadingUser(true);
		setUserError(null);

		async function fetchProfile() {
			try {
				const data = await getProfile();
				if (!mounted) return;
				setUser(data);
			} catch (err: any) {
				console.error("profile fetch:", err);
				// handle 401 -> force logout and redirect
				const status = err?.response?.status;
				if (status === 401 || err?.response?.data?.detail === "Authentication credentials were not provided.") {
					clearTokens();
					router.replace("/login");
					return;
				}
				setUserError(err?.response?.data?.detail || err.message || "Failed to load profile");
			} finally {
				if (mounted) setLoadingUser(false);
			}
		}

		fetchProfile();

		return () => {
			mounted = false;
		};
	}, [router]);

	if (!user) return <div>Loading...</div>;

	if (loadingUser) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-gray-600">Loading profile…</div>
			</div>
		);
	}

	if (userError) {
		return (
			<div className="p-6">
				<div className="text-red-600 mb-4">Error: {userError}</div>
				<button onClick={() => router.refresh()} className="px-3 py-2 bg-indigo-600 text-white rounded">Retry</button>
			</div>
		);
	}

	const profileImage = user?.profile_image || "/images/avatar-placeholder.jpg"; // add a local placeholder file to public/images
	const displayName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Your Name";
	const email = user?.email ?? "no-email@example.com";

	async function openInfo() {
		setInfoError(null);
		setInfoLoading(true);
		try {
			const data = await getProfile();
			setInfoUser(data);
			setShowInfoModal(true);
		} catch (err: any) {
			console.error("getProfile:", err);
			const status = err?.response?.status;
			if (status === 401) { // optional: force logout
				clearTokens();
				router.replace("/login");
				return;
			}
			setInfoError(err?.response?.data?.detail || err.message || "Failed to load user info");
		} finally {
			setInfoLoading(false);
		}
	}

	return (
		<div className="flex w-full h-auto">

			{/* LEFT SIDEBAR */}
			<aside className="w-[340px] h-screen bg-[#0D224A] text-white p-6 flex flex-col justify-between">

				{/* TOP PART */}
				<div>
					{/* Profile */}
					<div className="flex flex-col items-center">
						<img
							src={profileImage}
							alt={displayName || "Profile"}
							className="rounded-full w-24 h-24 border-2 border-white object-cover"
							onError={(e) => {
								// fallback if image URL returns 404
								(e.target as HTMLImageElement).src = "/images/avatar-placeholder.png";
							}}
						/>
						<div className="flex items-center gap-3">
							<h2 className="text-xl font-semibold mt-4">{displayName}</h2>
							<button
								onClick={openInfo}
								title="View profile details"
								className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-b-lg bg-white/20 hover:bg-white/30 text-white text-sm"
							>
								info
							</button>
							{infoLoading && <span className="ml-2 text-sm text-gray-500">Loading…</span>}
						</div>
						<p className="text-sm text-gray-200">{email}</p>
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
				<button onClick={() => logout()} className="bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-6">
					Log Out
				</button>

			</aside>

			{/* RIGHT MAIN AREA */}
			<main className="w-[1100px] bg-gray-100 overflow-hidden">

				<div className="    flex flex-row 
    			items-center 
    			justify-between 
    			gap-[664px]
    			w-[1100px] 
    			h-[88px] 
    			ml-[0px]
    			pl-[80px] 
    			pr-[80px] 
    		bg-white overflow-hidden">
					<h1 className="text-2xl font-bold text-gray-800">Company name</h1>
					<p className="text-gray-600 bg-white p-0 m-0">{today}</p>
				</div>

				{/* MAIN CONTENT */}
				<div>
					{activeTab === "todo" ? (
						<div>
							{/* TODO CONTENT HERE */}
							<TodoList initialFilterCompleted={true} />
						</div>
					) : (
						<div>
							{/* ACCOUNT INFO HERE */}
							<AccountInfo initial={user} onSuccess={(updated) => setUser(updated)} />
						</div>
					)}
				</div>

			</main>
			{showInfoModal && infoUser && (
				<UserInfoModal
					user={infoUser}
					onClose={() => setShowInfoModal(false)}
				/>
			)}

			{/* optionally show an inline error if fetching info failed */}
			{infoError && <div className="text-sm text-red-600 mt-2">{infoError}</div>}

		</div>
	);
}

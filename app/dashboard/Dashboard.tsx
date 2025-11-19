"use client";

import useAuth from "@/hooks/useAuth";
import { clearTokens, getProfile } from "@/services/auth";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import AccountInfo from "./comp/AccountInfo";
import { useRouter } from "next/navigation";
import UserInfoModal from "@/components/UserInfoModal";
import { IconCapRounded, IconClipboardCheck, IconInfoCircle, IconLogout, IconUser } from "@tabler/icons-react";


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

	const profileImage = user?.profile_image || "/images/avatar-placeholder.jpg";
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
		<div className="flex w-full min-h-screen">

			{/* LEFT SIDEBAR */}
			<div className="w-[340px] h-auto bg-[#0D224A] text-white p-0 flex flex-col justify-between">

				{/* TOP PART */}
				<div>
					{/* Profile */}
					<div className="flex flex-col items-center px-6 py-6">
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
								className="items-center mt-6"
							>
								<IconInfoCircle className="hover:text-amber-300 rounded-2xl" />
							</button>
							{infoLoading && <span className="ml-2 text-sm text-gray-500">Loading…</span>}
						</div>
						<p className="text-sm text-gray-200">{email}</p>
					</div>

					{/* Menu */}
					<div className="flex flex-col mt-8">
						<button
							onClick={() => setActiveTab("todo")}
							className={`text-left p-2
								${activeTab === "todo" ? "bg-gradient-to-r from-[#4c5f83] to-[#0D224A] text-white" : "hover:bg-[#28406d]"}
							`}
						>
							<div className="flex px-6"><IconClipboardCheck /><p className="px-2">Todo</p></div>
						</button>

						<button
							onClick={() => setActiveTab("account")}
							className={`text-left p-2 
								${activeTab === "account" ? " bg-gradient-to-r from-[#4c5f83] to-[#0D224A] text-white" : "hover:bg-[#28406d]"}
							`}
						>
							<div className="flex px-6" ><IconUser /><p className="px-2">Account Info</p></div>
						</button>
					</div>
				</div>

				{/* Logout Button */}
				<button onClick={() => logout()} className="mb-10 p-2 from-[#4c5f83] to-[#0D224A] text-white hover:bg-gradient-to-r">
					<div className="flex px-6"><IconLogout /><p className="px-2">Log out</p></div>
				</button>

			</div>

			{/* RIGHT MAIN AREA */}
			<div className="w-[1100px] h-auto bg-gray-100 overflow-hidden">

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
					<h1 className="text-2xl font-bold text-balance text-gray-800">Pioneer alpha</h1>
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

			</div>
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

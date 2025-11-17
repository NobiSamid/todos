"use client";

import { updateProfile } from '@/services/auth';
import { UpdateProfilePayload } from '@/types/type';
import React, { useRef, useState } from 'react'
import ChangePasswordModal from './ChangePassModal';

type Props = {
	initial?: {
		first_name?: string;
		last_name?: string;
		address?: string;
		contact_number?: string;
		birthday?: string;
		bio?: string;
		profile_image?: string; 
		email?: string;
	};
	onSuccess?: (updatedUser: any) => void;
};

export default function AccountInfo({ initial = {}, onSuccess }: Props) {
	const [firstName, setFirstName] = useState(initial.first_name || "");
	const [lastName, setLastName] = useState(initial.last_name || "");
	const [address, setAddress] = useState(initial.address || "");
	const [contactNumber, setContactNumber] = useState(initial.contact_number || "");
	const [birthday, setBirthday] = useState(initial.birthday || "");
	const [bio, setBio] = useState(initial.bio || "");
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(initial.profile_image || null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

    const [openChangePassword, setOpenChangePassword] = useState(false);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0] ?? null;
		setFile(f);
		if (f) {
			const url = URL.createObjectURL(f);
			setPreview(url);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		// Basic validation
		if (!firstName.trim() || !lastName.trim()) {
			setError("First and Last name are required.");
			return;
		}

		setLoading(true);
		try {
			const payload: UpdateProfilePayload = {
				first_name: firstName,
				last_name: lastName,
				address,
				contact_number: contactNumber,
				birthday,
				bio,
				profile_image: file ?? undefined,
			};

			const updated = await updateProfile(payload);
			setSuccess("Profile updated successfully.");
			onSuccess?.(updated);
			// update preview from returned data
			if (updated.profile_image) setPreview(updated.profile_image);
		} catch (err: any) {
			console.error(err);
			setError(err?.response?.data?.detail || err.message || "Update failed");
		} finally {
			setLoading(false);
			// revoke object URL after some time to free memory if created
			// if (file) URL.revokeObjectURL(preview || "");
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
				<h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

				{error && <div className="mb-3 text-red-600">{error}</div>}
				{success && <div className="mb-3 text-green-600">{success}</div>}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-1">First name</label>
						<input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border p-2 rounded" />
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Last name</label>
						<input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border p-2 rounded" />
					</div>

					<div className="sm:col-span-2">
						<label className="block text-sm font-medium mb-1">Address</label>
						<input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-2 rounded" />
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Contact number</label>
						<input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full border p-2 rounded" />
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Birthday</label>
						<input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="w-full border p-2 rounded" />
					</div>

					<div className="sm:col-span-2">
						<label className="block text-sm font-medium mb-1">Bio</label>
						<textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full border p-2 rounded" rows={4} />
					</div>

					<div className="sm:col-span-2 flex items-center gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Profile Image</label>
							<div className="flex items-center gap-3">
								<button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-gray-100 border rounded">Choose file</button>
								<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
								<span className="text-sm text-gray-500">{file?.name ?? (preview ? "Current image" : "No image")}</span>
							</div>
						</div>

						{preview && (
							<img src={preview} alt="preview" className="w-20 h-20 rounded-full object-cover border" />
						)}
					</div>
				</div>

				<div className="mt-6 flex items-center justify-between">
					<button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
						{loading ? "Saving..." : "Save changes"}
					</button>

					<button type="button" onClick={() => {
						// reset to initial values
						setFirstName(initial.first_name || "");
						setLastName(initial.last_name || "");
						setAddress(initial.address || "");
						setContactNumber(initial.contact_number || "");
						setBirthday(initial.birthday || "");
						setBio(initial.bio || "");
						setFile(null);
						setPreview(initial.profile_image || null);
					}} className="px-3 py-2 border rounded bg-white">
						Reset
					</button>
				</div>
			</form>
      <button type="button" onClick={() => setOpenChangePassword(true)} className="px-3 py-2 border rounded bg-white">
        Change password
      </button>
            {openChangePassword && (
        <ChangePasswordModal
          onClose={() => setOpenChangePassword(false)}
          onSuccess={(msg) => {
          //show toast or update UI
            console.log("Password changed:", msg);
          }}
        />
      )}
		</div >
	);
}
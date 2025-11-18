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
    <div className="
      w-[947px]
      absolute
      top-[100px]
      left-[360px]
      rotate-0
      opacity-100
      rounded-[16px]
      flex flex-col
      gap-[24px]
      pt-[20px]
      pr-[28px]
      pl-[28px]
    bg-white">
      <div className='flex justify-between '>
        <h1 className="text-2xl font-bold">Account Information</h1>
        <button type="button" onClick={() => setOpenChangePassword(true)} className=" text-red-600">
          Change password
        </button>
      </div>
      <form onSubmit={handleSubmit} className=" bg-white pl-4, pr-4, pt-2, rounded shadow-2xl">

        {error && <div className="mb-3 text-red-600">{error}</div>}
        {success && <div className="mb-3 text-green-600">{success}</div>}
        <div className="sm:col-span-2 w-2xs h-20 p-6 flex items-center gap-4 shadow-2xs rotate-0 opacity-100 rounded-[16px]">
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
        <div className="w-full p-6 shadow-2xl rounded-[16px]">
          {/* Grid layout for form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* First + Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Birthdate (same width as First name) */}
            <div>
              <label className="block text-sm font-medium mb-1">Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Empty column so Birthday stays left-aligned */}
            <div></div>

            {/* Address + Contact Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact number</label>
              <input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Bio - Full Width */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border p-2 rounded"
                rows={1}
              />
            </div>
          </div>

          {/* Buttons — centered & side by side */}
          <div className="mt-6 flex justify-center gap-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                setFirstName(initial.first_name || "");
                setLastName(initial.last_name || "");
                setAddress(initial.address || "");
                setContactNumber(initial.contact_number || "");
                setBirthday(initial.birthday || "");
                setBio(initial.bio || "");
                setFile(null);
                setPreview(initial.profile_image || null);
              }}
              className="px-6 py-2 border rounded bg-white"
            >
              Cancel
            </button>
          </div>
        </div>

      </form>
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
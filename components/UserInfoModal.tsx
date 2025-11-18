"use client";

import React from "react";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  profile_image?: string;
  bio?: string;
};

export default function UserInfoModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const displayName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">User Information</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profile_image || "/images/avatar-placeholder.jpg"}
              alt={displayName || "Profile"}
              className="w-20 h-20 rounded-full object-cover border"
              onError={(e) => ((e.target as HTMLImageElement).src = "/images/avatar-placeholder.png")}
            />
            <div>
              <div className="text-lg font-semibold">{displayName || "—"}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
            <div><span className="font-medium">Address:</span> {user.address ?? "—"}</div>
            <div><span className="font-medium">Contact:</span> {user.contact_number ?? "—"}</div>
            <div><span className="font-medium">Birthday:</span> {user.birthday ?? "—"}</div>
            <div><span className="font-medium">Bio:</span> {user.bio ?? "—"}</div>
          </div>

          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

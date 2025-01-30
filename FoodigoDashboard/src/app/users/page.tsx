"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

async function getUsers() {
  try {
    const response = await fetch("http://localhost:5001/api/admin/all-users", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function updateUser(userId: string, updates: any) {
  try {
    const response = await fetch(
      `http://localhost:5001/api/admin/users/${userId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      },
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    throw error;
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function UserEditModal({ user, onSave, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    isVerified: user?.isVerified || false,
    isActive: user?.isActive || false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Verified
          </label>
          <div
            className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
              formData.isVerified ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() =>
              setFormData({ ...formData, isVerified: !formData.isVerified })
            }
          >
            <div
              className={`absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isVerified ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active
          </label>
          <div
            className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
              formData.isActive ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() =>
              setFormData({ ...formData, isActive: !formData.isActive })
            }
          >
            <div
              className={`absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function AdminUsersManager() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      setData(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      await updateUser(userId, updates);
      await fetchUsers();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-16 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Users
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Users: {data.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableHead className="bg-gray-50 py-4 text-center text-sm font-semibold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Profile Picture
              </TableHead>
              <TableHead className="bg-gray-50 py-4 text-left text-sm font-semibold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Name
              </TableHead>
              <TableHead className="bg-gray-50 py-4 text-center text-sm font-semibold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Joined
              </TableHead>
              <TableHead className="bg-gray-50 py-4 text-right text-sm font-semibold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Status
              </TableHead>
              <TableHead className="bg-gray-50 py-4 text-center text-sm font-semibold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((user) => (
              <TableRow
                key={user._id}
                className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <TableCell className="py-4 text-center">
                  <div className="flex justify-center">
                    {user.ProfilePicURL ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-200 transition-all group-hover:ring-blue-400 dark:ring-gray-700">
                        <Image
                          src={user.ProfilePicURL}
                          className="rounded-full object-cover"
                          fill
                          sizes="40px"
                          alt={`${user.name}'s Profile Picture`}
                          role="presentation"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-left font-medium text-gray-900 dark:text-white">
                  <div>{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </TableCell>
                <TableCell className="py-4 text-center text-gray-600 dark:text-gray-300">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user?.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user?.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.isVerified
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onSave={(updates) => handleUpdateUser(selectedUser._id, updates)}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminUsersManager;

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
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

async function getUsers() {
  try {
    const response = await fetch(
      "https://foodigo.onrender.com/api/admin/users",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
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

export function UsersTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        setData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h2 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
          Top Channels
        </h2>

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
                Groceries
              </TableHead>
              <TableHead className="bg-gray-50 py-4 text-center text-sm font-semibold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Favorites
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={100}>
                  <Skeleton className="h-8" />
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
          Users
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
                Groceries
              </TableHead>
              <TableHead className="bg-gray-50 py-4 text-center text-sm font-semibold uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Favorites
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
                  {user.name}
                </TableCell>
                <TableCell className="py-4 text-center text-gray-600 dark:text-gray-300">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="py-4 text-right font-medium text-gray-900 dark:text-white">
                  {user.groceriesCount}
                </TableCell>
                <TableCell className="py-4 text-center font-medium text-gray-900 dark:text-white">
                  {user.favoritesCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UsersTable;

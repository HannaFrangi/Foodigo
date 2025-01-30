"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

const NAV_LINKS = [
  {
    href: "/profile",
    icon: UserIcon,
    label: "View profile",
  },
  {
    href: "/pages/settings",
    icon: SettingsIcon,
    label: "Account Settings",
  },
];

const DEFAULT_AVATAR = "/images/user/logo.png";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    img: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem("authUser");
      setUser({ name: "", email: "", img: null });
      setIsOpen(false);
    } catch (error) {
      setError("Failed to log out. Please try again.");
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) {
          setUser({
            name: parsedUser.name,
            email: parsedUser.email || "",
            img: parsedUser.ProfilePicURL || null,
          });
        }
      } catch (error) {
        setError("Failed to load user data");
        console.error("Error loading user data:", error);
      }
    }
    setLoading(false); // Set loading to false after trying to fetch user data
  }, []);

  const UserAvatar = ({ className = "", size = "size-12" }) => (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden",
        size,
        className,
      )}
    >
      <Image
        src={user?.img || DEFAULT_AVATAR}
        unoptimized
        className={cn(
          "rounded-full object-cover transition-all duration-300",
          "group-hover:scale-110",
          "border-2 border-primary/20",
          size,
        )}
        alt={`Avatar of ${user.name || "user"}`}
        width={200}
        height={200}
        priority
        onError={(e) => {
          console.error("Image loading error:", e);
          setImageError(true);
          (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
        }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent",
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          "rounded-full",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 ring-2 ring-primary/30 ring-offset-2",
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          "rounded-full",
        )}
      />
    </div>
  );

  if (loading) {
    return <div>Loading...</div>; // Show a loading state until user data is available
  }

  if (error) {
    return <div className="p-2 text-red-500">{error}</div>;
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>
        <figure className="flex items-center gap-3">
          <UserAvatar />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{user.name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <UserAvatar size="size-14" />
          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {user.name}
            </div>
            <div className="leading-none text-gray-6">{user.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <nav className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <Icon />
              <span className="mr-auto text-base font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />
            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

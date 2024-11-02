import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { Avatar, Dropdown } from "antd";

import {
  Search,
  Menu,
  X,
  Home,
  BookOpen,
  Heart,
  UtensilsCrossed,
  ChefHat,
  User,
  LogOut,
  Settings,
  PlusCircle,
} from "lucide-react";

// UserMenu Component using Ant Design
const UserAvatar = ({ user }) => {
  if (!user) {
    return (
      <Link
        to="/auth/login"
        className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-700 hover:bg-[#5d6544]/10 hover:text-[#5d6544] transition-colors duration-200"
      >
        <Avatar icon={<User className="h-5 w-5" />} />
        <span>Sign In</span>
      </Link>
    );
  }

  const menuItems = [
    {
      key: "profile",
      label: (
        <Link to="/profile" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Profile Settings</span>
        </Link>
      ),
    },
    {
      key: "new-recipe",
      label: (
        <Link to="/recipes/new" className="flex items-center space-x-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Recipe</span>
        </Link>
      ),
    },
    {
      key: "signout",
      label: (
        <div className="flex items-center space-x-2 text-red-500">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={["click"]}
      overlayClassName="w-48"
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="flex items-center">
          {user.imageUrl ? (
            <Avatar
              src={user.imageUrl}
              className="border-2 border-[#5d6544]"
              size="large"
            />
          ) : (
            <Avatar
              size="large"
              className="bg-[#5d6544] flex items-center justify-center"
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <div className="hidden md:block ml-2">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </Dropdown>
  );
};

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/recipes", label: "Recipes", icon: BookOpen },
    { path: "/favorites", label: "Favorites", icon: Heart },
    { path: "/categories", label: "Categories", icon: UtensilsCrossed },
  ];

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  return (
    <nav ref={navRef} className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-[#5d6544] p-2 rounded-full">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-[#5d6544]">
                FOODIGO
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium
                  ${
                    location.pathname === path
                      ? "text-[#5d6544] bg-[#5d6544]/10"
                      : "text-gray-700 hover:text-[#5d6544] hover:bg-[#5d6544]/10"
                  } transition-colors duration-200`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            <UserAvatar user={user} />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <UserAvatar user={user} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#5d6544] focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium
                  ${
                    location.pathname === path
                      ? "text-[#5d6544] bg-[#5d6544]/10"
                      : "text-gray-700 hover:text-[#5d6544] hover:bg-[#5d6544]/10"
                  } transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const PageLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const mainContentRef = useRef(null);
  const heroRef = useRef(null);

  const [user, setUser] = useState(false);

  useEffect(() => {
    gsap.from(mainContentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
    });

    if (location.pathname === "/" && heroRef.current) {
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar user={user} />}

      {location.pathname === "/" && !isAuthPage && (
        <div ref={heroRef}>
          <searchHero />
        </div>
      )}

      <main
        ref={mainContentRef}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          !isAuthPage ? "py-8" : ""
        }`}
      >
        <div
          className={`${
            !isAuthPage ? "bg-white rounded-lg shadow-sm p-6" : ""
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;

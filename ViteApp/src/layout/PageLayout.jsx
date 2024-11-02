import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
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

// Avatar Component
const UserAvatar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  if (!user) {
    return (
      <Link
        to="/auth/login"
        className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
      >
        <User className="h-5 w-5" />
        <span>Sign In</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        ref={avatarRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="relative">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover border-2 border-orange-500"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              {getUserInitial(user.name)}
            </div>
          )}
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
            >
              <Settings className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
            <Link
              to="/recipes/new"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Recipe</span>
            </Link>
            <button
              onClick={() => {
                /* Implement logout functionality */
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
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
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">
                RecipeFinder
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
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
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
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
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
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
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

  const user = {
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk ",
  };

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
        <div
          ref={heroRef}
          className="bg-gradient-to-r from-orange-400 to-orange-500 p-8 text-white text-center"
        >
          <h1 className="text-4xl font-bold">Welcome to RecipeFinder</h1>
          <p className="mt-2 text-lg">Find, cook, and share amazing recipes</p>
        </div>
      )}

      <main ref={mainContentRef} className="py-8">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;

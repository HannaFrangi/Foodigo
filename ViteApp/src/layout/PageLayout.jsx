import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import {
  Home,
  BookOpen,
  Heart,
  UtensilsCrossed,
  ChefHat,
  LogOut,
  Settings,
  PlusCircle,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import logo from "/src/assets/logo.png";

// Keeping original user menu with material styling
const UserAvatar = ({ user }) => {
  if (!user) {
    return (
      <Link
        to="/auth"
        className="flex items-center space-x-2 px-6 py-2 rounded-full bg-white border-2 border-[#5d6544] text-[#5d6544] hover:bg-[#5d6544] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Avatar icon={<ChefHat className="h-5 w-5" />} />
        <span className="font-medium">Sign In</span>
      </Link>
    );
  }

  const menuItems = [
    {
      key: "profile",
      label: (
        <Link
          to="/profile"
          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Profile Settings</span>
        </Link>
      ),
    },
    {
      key: "new-recipe",
      label: (
        <Link
          to="/recipes/new"
          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Recipe</span>
        </Link>
      ),
    },
    {
      key: "signout",
      label: (
        <div className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
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
      overlayClassName="w-48 mt-1 p-1 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors">
        <div className="flex items-center">
          {user.imageUrl ? (
            <Avatar
              src={user.imageUrl}
              className="border-2 border-[#5d6544] shadow-sm"
              size="large"
            />
          ) : (
            <Avatar
              size="large"
              className="bg-[#5d6544] flex items-center justify-center shadow-sm"
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

const NavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200
      ${
        isActive
          ? "bg-[#5d6544]/10 text-[#5d6544] font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
  >
    <Icon
      className={`h-5 w-5 transition-colors ${
        isActive ? "text-[#5d6544]" : "text-gray-500"
      }`}
    />
    <span>{label}</span>
  </Link>
);

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/recipe", label: "Recipes", icon: BookOpen },
    { path: "/favorites", label: "Favorites", icon: Heart },
    // { path: "/categories", label: "Categories", icon: UtensilsCrossed },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add("shadow-md");
          nav.style.backdropFilter = "blur(10px)";
          nav.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        } else {
          nav.classList.remove("shadow-md");
          nav.style.backdropFilter = "none";
          nav.style.backgroundColor = "white";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-white transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Avatar
                size={80}
                style={{ backgroundColor: "transparent" }}
                className="transition-transform hover:scale-105"
              >
                <img src={logo} alt="Foodigo" />
              </Avatar>
              <span className="ml-2 text-xl font-bold text-[#5d6544]">
                FOODIGO
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
              />
            ))}
            <div className="ml-4">
              <UserAvatar user={user} />
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <UserAvatar user={user} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

const PageLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isErrorPage = location.pathname.startsWith("/*");
  const mainContentRef = useRef(null);
  const [user, setUser] = useState(false);
  // const [user, setUser] = useState({
  //   name: "Majd Chbat",
  //   email: "MajdChbat@gmail.com",
  //   imageUrl:
  //     "https://media.licdn.com/dms/image/v2/D4D03AQHludua8pSwVA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1708593323172?e=2147483647&v=beta&t=zcf9XPUOz4WaA3thYabfB3oRLFb-DPKJT2My4kI8Y-M",
  // });

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.style.opacity = "0";
      mainContentRef.current.style.transform = "translateY(20px)";

      requestAnimationFrame(() => {
        mainContentRef.current.style.transition = "all 0.5s ease-out";
        mainContentRef.current.style.opacity = "1";
        mainContentRef.current.style.transform = "translateY(0)";
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar user={user} />}
      <main
        ref={mainContentRef}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          !isAuthPage ? "py-8" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout;

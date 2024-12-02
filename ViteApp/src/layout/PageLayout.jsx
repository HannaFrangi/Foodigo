import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import {
  Home,
  BookOpen,
  Heart,
  ChefHat,
  LogOut,
  Settings,
  PlusCircle,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/src/assets/logo.png";
import { useAuthStore } from "../store/useAuthStore";
import ProfileModal from "../pages/Profile/ProfileModal";

const UserAvatar = ({ user, handleLogout, onProfileEdit }) => {
  if (!user) {
    return (
      <Link
        to="/auth"
        className="flex items-center justify-center space-x-2 
        px-4 py-2 rounded-full 
        bg-[#5d6544] text-white 
        hover:bg-[#6d7a54] 
        transition-colors duration-300 
        text-sm font-medium 
        shadow-md hover:shadow-lg 
        active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-[#5d6544] focus:ring-opacity-50"
      >
        <ChefHat className="h-4 w-4 md:h-5 md:w-5" />
        <span className="hidden xs:inline">Sign In</span>
        <span className="xs:hidden">Login</span>
      </Link>
    );
  }

  const menuItems = [
    {
      key: "profile",
      label: (
        <div
          onClick={onProfileEdit}
          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          <span>Profile Settings</span>
        </div>
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
        <div
          className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
          onClick={handleLogout}
        >
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
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          {user.ProfilePicURL ? (
            <Avatar
              src={user.ProfilePicURL}
              className="border-2 border-[#5d6544] shadow-sm"
              size={40}
            />
          ) : (
            <Avatar
              size={40}
              className="bg-gradient-to-r from-[#5d6544] to-[#7a8c5a] flex items-center justify-center shadow-sm"
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <div className="hidden md:block ml-2">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              {user.email}
            </p>
          </div>
        </div>
      </motion.div>
    </Dropdown>
  );
};

const NavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 group
      ${
        isActive
          ? "bg-[#5d6544]/10 text-[#5d6544] font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-[#5d6544]"
      }`}
  >
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Icon
        className={`h-5 w-5 transition-colors 
          ${
            isActive
              ? "text-[#5d6544]"
              : "text-gray-500 group-hover:text-[#5d6544]"
          }`}
      />
    </motion.div>
    <span>{label}</span>
  </Link>
);

const Navbar = ({ user, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const searchInputRef = useRef(null);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/recipe", label: "Recipes", icon: BookOpen },
    { path: "/favorites", label: "Favorites", icon: Heart },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add("shadow-md");
          nav.style.backdropFilter = "blur(15px)";
          nav.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleProfileEdit = () => {
    setIsProfileModalVisible(true);
  };

  const handleProfileModalCancel = () => {
    setIsProfileModalVisible(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 bg-white transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center"
                aria-label="Foodigo Home"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Avatar
                    size={80}
                    style={{ backgroundColor: "transparent" }}
                    className="transition-transform"
                  >
                    <img src={logo} alt="Foodigo" />
                  </Avatar>
                </motion.div>
                <span className="ml-2 text-xl font-bold text-[#5d6544]">
                  FOODIGO
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-2"
              >
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </motion.div>

              <div>
                <UserAvatar
                  user={user}
                  handleLogout={handleLogout}
                  onProfileEdit={handleProfileEdit}
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <UserAvatar
                user={user}
                handleLogout={handleLogout}
                onProfileEdit={handleProfileEdit}
              />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-gray-800" />
                ) : (
                  <MenuIcon className="h-5 w-5 text-gray-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        visible={isProfileModalVisible}
        onCancel={handleProfileModalCancel}
      />
    </>
  );
};

const PageLayout = ({ children, authUser }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isResetPage = location.pathname.startsWith("/reset-password");
  const isVerificationPage = location.pathname.startsWith("/verify");
  const mainContentRef = useRef(null);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.style.opacity = "0";
      mainContentRef.current.style.transform = "translateY(20px)";
      requestAnimationFrame(() => {
        mainContentRef.current.style.transition =
          "opacity 0.5s ease, transform 0.5s ease";
        mainContentRef.current.style.opacity = "1";
        mainContentRef.current.style.transform = "translateY(0)";
      });
    }
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen"
    >
      {!isAuthPage && !isResetPage && !isVerificationPage && (
        <Navbar user={authUser} handleLogout={handleLogout} />
      )}
      <main
        ref={mainContentRef}
        className="flex-1 bg-gray-50 transition-all duration-500"
      >
        {children}
      </main>
    </motion.div>
  );
};

export default PageLayout;

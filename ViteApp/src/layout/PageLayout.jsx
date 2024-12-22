import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
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
        className="flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-[#5d6544] text-white hover:bg-[#6d7a54] transition-colors duration-300 text-sm font-medium shadow-sm hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5d6544] focus:ring-opacity-50  shadow-olive"
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
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
                  <Avatar size={80} style={{ backgroundColor: "transparent" }}>
                    <img src={logo} alt="Foodigo" />
                  </Avatar>
                </motion.div>
                <span className="ml-2 text-xl font-bold text-[#5d6544]">
                  FOODIGO
                </span>
              </Link>
            </div>

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

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesConfig = {
    particles: {
      number: {
        value: 15,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"],
      },
      shape: {
        type: "image",
        image: [
          {
            // Cucumber
            src: "https://media.istockphoto.com/id/623826910/photo/fresh-cucumbers-isolated-on-white.jpg?s=612x612&w=0&k=20&c=0WBFd1_OlpZDBlRFXRyO5d9l9HhQf3zPUeQ-up5j5RM=",
            width: 25,
            height: 25,
          },
          {
            // Potato
            src: "https://media.istockphoto.com/id/176012507/photo/single-potato.jpg?s=612x612&w=0&k=20&c=9YsTiEiiAKFvBnCYUy-Z3BnnbgX8MdgtLTDP36Y0JzI=",
            width: 25,
            height: 25,
          },
          {
            // Lettuce
            src: "https://media.istockphoto.com/id/181072765/photo/lettuce-isolated-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=axHLN2tckTBwUBZEsd1-LNhnQZ_LMWEGmMBLRVe1qwQ=",
            width: 25,
            height: 25,
          },
          {
            // Chocolate
            src: "https://media.istockphoto.com/id/1362814297/photo/chocolate-splashed-with-chocolate-bar-on-transparent-background-clipping-path.jpg?s=612x612&w=0&k=20&c=0DUx4M9mfWn5dh5NpDG9YDP8zxnxCu5baHfJnoIi_B8=",
            width: 25,
            height: 25,
          },
          {
            // Cabbage
            src: "https://media.istockphoto.com/id/673162168/photo/green-cabbage-isolated-on-white.jpg?s=612x612&w=0&k=20&c=mCc4mXATvCcfp2E9taRJBp-QPYQ_LCj6nE1D7geaqVk=",
            width: 25,
            height: 25,
          },
          {
            // Banana
            src: "https://media.istockphoto.com/id/1400057530/photo/bananas-isolated.jpg?s=612x612&w=0&k=20&c=KLtV4quCnxwWOOx_uUJTQUTl9VVJzA72ykrQlc8P6a0=",
            width: 25,
            height: 25,
          },
          {
            // Nutella
            src: "https://media.istockphoto.com/id/526549843/photo/chocolate-spread-on-toast.jpg?s=612x612&w=0&k=20&c=pUkjMOPVARr-jZkqGL4fYC5UScPCEC6GV2sEXFXjgpY=",
            width: 25,
            height: 25,
          },
          {
            // Apple
            src: "https://media.istockphoto.com/id/185262648/photo/red-apple-with-leaf-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=gUTvQuVPUxUYX1CEj-N3lW5eRFLlkGrU_cwwwOWxOh8=",
            width: 25,
            height: 25,
          },
          {
            // Apple
            src: "https://media.istockphoto.com/id/95761550/photo/professional-photograph-of-a-green-apple.jpg?s=612x612&w=0&k=20&c=bgmacIRnZ7skrpJgBOQ-sF4SQZ_nHUKs9MjT73jC05g=",
            width: 25,
            height: 25,
          },
          {
            // Grapes
            src: "https://media.istockphoto.com/id/171151560/photo/black-grapes.jpg?s=612x612&w=0&k=20&c=wxIVbjEW-ImVmgUk-9OxYN5SNEOMN-3i1daz8YHzefU=",
            width: 25,
            height: 25,
          },
          {
            // Carrot
            src: "https://media.istockphoto.com/id/166106089/photo/carrot-isolated.jpg?s=612x612&w=0&k=20&c=bWUuopSQ247cy0k6IzvVnrgixff496_HmIBjtiUzzDM=",
            width: 25,
            height: 25,
          },
          {
            // Tomato
            src: "https://media.istockphoto.com/id/1450576005/photo/tomato-isolated-tomato-on-white-background-perfect-retouched-tomatoe-side-view-with-clipping.jpg?s=612x612&w=0&k=20&c=lkQa_rpaKpc-ELRRGobYVJH-eMJ0ew9BckCqavkSTA0=",
            width: 25,
            height: 25,
          },
          {
            // Tomato
            src: "https://media.istockphoto.com/id/182746000/photo/tomato-slice.jpg?s=612x612&w=0&k=20&c=d5gHGWG13hRNA48PQn_io7tzi3VudgrwBZiJT7rqjVU=",
            width: 25,
            height: 25,
          },
          {
            // Cake
            src: "https://media.istockphoto.com/id/903494838/photo/triangle-shape-slice-piece-of-chocolate-fudge-cake-decorated-with-chocolate-curl-on-white.jpg?s=612x612&w=0&k=20&c=0fPve8ccjObRHtqsMFVwP5j_oL07V5Am5AVu4izPApI=",
            width: 25,
            height: 25,
          },
          {
            // Ice Cream
            src: "https://media.istockphoto.com/id/165932954/photo/triple-ice-cream.jpg?s=612x612&w=0&k=20&c=U6NmisiJIjNnwHdNse3W6QpCJDlufqkY66T9-w4h_So=",
            width: 25,
            height: 25,
          },
          {
            // Coffee
            src: "https://media.istockphoto.com/id/1451731154/photo/many-roasted-coffee-beans-flying-on-white-background.jpg?s=612x612&w=0&k=20&c=-GpLe7IvBTS77X5QjbuT_1HLFcK1OjGm9c-oOnuPZOI=",
            width: 25,
            height: 25,
          },
          {
            // Soda
            src: "https://media.istockphoto.com/id/655123574/photo/soft-drinks-splashing.jpg?s=612x612&w=0&k=20&c=iZcaMSEuzxLRy2lpnUw9NhnTcOhYNgxA3poBbjCsSSc=",
            width: 25,
            height: 25,
          },
          {
            // Chips
            src: "https://media.istockphoto.com/id/1136738223/photo/freshly-cooked-potato-chips.jpg?s=612x612&w=0&k=20&c=5OaAeBvtiQ2Avl4V9l_9P03L1D5mn7Eq7cp1OeojZtQ=",
            width: 25,
            height: 25,
          },
          {
            // Popcorn
            src: "https://media.istockphoto.com/id/1479561029/vector/popcorn-flakes-flying-to-bucket-realistic-popcorn.jpg?s=612x612&w=0&k=20&c=RY0uoxuqkysSSL0CI3bS8HOiIdT_OgAkTDpPKzJx-eA=",
            width: 25,
            height: 25,
          },
          {
            //corn
            src: "https://media.istockphoto.com/id/1317520435/photo/corn-isolated-on-a-white-background.jpg?s=612x612&w=0&k=20&c=n-nRK2IGhLXhirMYqtwc9GEOH_X2QeOrM7Uk6dmo_aE=",
            width: 25,
            height: 25,
          },
        ],
      },
      opacity: {
        value: 0.7,
      },
      size: {
        value: 25,
        random: true,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        out_mode: "out",
      },
    },
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
      />
      {!isAuthPage && !isResetPage && !isVerificationPage && (
        <Navbar user={authUser} handleLogout={logout} />
      )}
      <main ref={mainContentRef} className="min-h-screen bg-white">
        {children}
      </main>
    </>
  );
};

export default PageLayout;

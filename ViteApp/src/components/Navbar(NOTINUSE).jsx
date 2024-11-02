import React, { useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { gsap } from "gsap";
import { useStore } from "../store/useStore";
import { UseToggleStyles } from "../hooks/useToggleStyles";
import { Avatar } from "@mui/material";

const Navbar = () => {
  const isMenuOpen = useStore((state) => state.isMenuOpen);

  const menuClasses = `menu transition-all duration-500 ${
    isMenuOpen ? "translate-x-0" : "translate-x-full"
  } fixed z-50 flex flex-col items-center justify-center w-full lg:w-[600px] text-center lg:text-left h-full right-0 top-0 bg-white/95 backdrop-blur-sm border shadow-lg`;

  return (
    <header className="relative z-50 w-full px-4">
      <div className="flex items-center justify-between mx-auto max-w-7xl py-4 border-b border-zinc-200">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-x-4 w-36 group">
            <div className="relative transform transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-red-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              <Avatar
                src="/src/assets/logo.png"
                alt="foodigo logo"
                className="relative z-10"
              />
            </div>
            <span className="text-2xl font-bold text-red-600 transition-colors duration-300 group-hover:text-red-700">
              Foodigo
            </span>
          </Link>
        </div>

        <NavbarMenuButton />
      </div>
      <Menu classes={menuClasses} />
    </header>
  );
};

const NavbarMenuButton = () => {
  const { toggleStyles } = UseToggleStyles();
  const buttonRef = useRef(null);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const [isHovered, setIsHovered] = React.useState(false);

  const callParallax = (e) => {
    parallaxIt(e, buttonRef.current, 25);
  };

  const parallaxIt = (e, target, movement) => {
    const rect = target.getBoundingClientRect();
    const relX = e.pageX - rect.left - window.scrollX;
    const relY = e.pageY - rect.top - window.scrollY;

    gsap.to(target, {
      duration: 0.3,
      x: ((relX - rect.width / 2) / rect.width) * movement,
      y: ((relY - rect.height / 2) / rect.height) * movement,
      ease: "power2.out",
    });
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    gsap.to(buttonRef.current, {
      duration: 0.3,
      scale: 1,
      x: 0,
      y: 0,
      backgroundColor: "transparent",
    });
  };

  const onMouseEnter = () => {
    setIsHovered(true);
    gsap.to(buttonRef.current, {
      duration: 0.3,
      scale: 1.1,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    });
  };

  return (
    <>
      <div
        onClick={toggleStyles}
        className={`backdrop fixed opacity-0 pointer-events-none invisible top-0 bottom-0 left-0 right-0 bg-black/40 transition-opacity duration-300 ${
          isMenuOpen ? "!visible !opacity-100 pointer-events-auto" : ""
        }`}
      ></div>
      <button
        ref={buttonRef}
        onMouseMove={callParallax}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={toggleStyles}
        className="relative z-[60] flex flex-wrap justify-center items-center gap-5 transition-all duration-200 rounded-full p-3"
        aria-label="Menu"
      >
        <div className="Navmenu size-11 rounded-full flex justify-center items-center">
          <div className="lineContainer flex flex-col gap-[.3rem] justify-between h-[9px] relative">
            <div
              className={`line1 w-[25px] h-[1.5px] rounded-full bg-dark transition-all duration-300 ease-out ${
                isMenuOpen
                  ? "rotate-45 translate-y-[5px]"
                  : isHovered
                  ? "w-[20px] translate-x-[5px]"
                  : ""
              }`}
            ></div>
            <div
              className={`line2 w-[25px] h-[1.5px] rounded-full bg-dark transition-all duration-300 ease-out ${
                isMenuOpen
                  ? "-rotate-45 -translate-y-[5px]"
                  : isHovered
                  ? "w-[20px]"
                  : ""
              }`}
            ></div>
          </div>
        </div>
      </button>
    </>
  );
};

const Menu = ({ classes }) => {
  const { toggleStyles } = UseToggleStyles();

  const links = [
    { title: "Home", path: "/", icon: <FaHome />, isMain: true },
    { title: "About", path: "/about", icon: <FaInfoCircle />, isMain: true },
    {
      title: "Login",
      path: "/login",
      icon: <FaSignInAlt />,
      isAuth: true,
    },
    {
      title: "Sign Up",
      path: "/signup",
      icon: <FaUserPlus />,
      isAuth: true,
      isPrimary: true,
    },
  ];

  return (
    <div className={classes}>
      <div className="relative w-full max-w-lg mx-auto">
        <div className="flex flex-col text-2xl font-medium text-dark tracking-tight gap-8 p-8">
          {/* Main navigation links */}
          <div className="flex flex-col gap-6">
            {links
              .filter((link) => link.isMain)
              .map((link, index) => (
                <NavLink
                  key={index}
                  onClick={toggleStyles}
                  className={({ isActive }) =>
                    `link font-light flex items-center gap-3 transition-all duration-300 hover:text-red-600 hover:translate-x-2 ${
                      isActive ? "text-red-600 translate-x-2" : "text-gray-700"
                    }`
                  }
                  to={link.path}
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
                    {link.icon}
                  </span>
                  <span>{link.title}</span>
                </NavLink>
              ))}
          </div>

          {/* Auth links with special styling */}
          <div className="flex flex-col gap-4 pt-4 border-t border-zinc-200">
            {links
              .filter((link) => link.isAuth)
              .map((link, index) => (
                <NavLink
                  key={index}
                  onClick={toggleStyles}
                  className={({ isActive }) =>
                    `link font-light flex items-center gap-3 transition-all duration-300 px-4 py-2 rounded-full ${
                      link.isPrimary
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "text-red-600 hover:text-red-700"
                    } ${isActive && !link.isPrimary ? "text-red-700" : ""}`
                  }
                  to={link.path}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.title}</span>
                </NavLink>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

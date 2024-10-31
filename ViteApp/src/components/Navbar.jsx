import { useRef } from "react";
import { gsap } from "gsap";
import { UseToggleStyles } from "../hooks/useToggleStyles";
import { Link, NavLink } from "react-router-dom";
import logo from "/src/assets/logo.png";
import { useStore } from "../store/store";
import { FaHome, FaInfoCircle, FaHeart } from "react-icons/fa"; // Import icons

const Navbar = () => {
  const isMenuOpen = useStore((state) => state.isMenuOpen);

  const menuClasses = `menu transition-transform duration-300 ${
    isMenuOpen ? "translate-x-0" : "translate-x-full"
  } fixed z-50 flex flex-col items-center justify-center w-full lg:w-[600px] text-center lg:text-left h-full right-0 top-0 bg-white border shadow-lg`;

  return (
    <header className="relative z-50 flex items-center justify-between mt-10 lg:mx-auto max-w-7xl pb-7 border-b border-zinc-200">
      <div className="flex gap-10 items-center justify-between">
        <Link to="/" className="flex gap-x-4 w-36 items-center">
          <img src={logo} alt="foodigo logo" width={90} height={90} />
        </Link>
      </div>
      <NavbarMenuButton />
      <Menu classes={menuClasses} />
    </header>
  );
};

export default Navbar;

const NavbarMenuButton = () => {
  const { toggleStyles } = UseToggleStyles();
  const buttonRef = useRef(null);
  const isMenuOpen = useStore((state) => state.isMenuOpen);

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
    gsap.to(buttonRef.current, { duration: 0.3, scale: 1, x: 0, y: 0 });
  };

  const onMouseEnter = () => {
    gsap.to(buttonRef.current, { duration: 0.3, scale: 1.1 });
  };

  const onButtonClick = () => {
    toggleStyles();
  };

  const backdropClasses = `backdrop fixed opacity-0 pointer-events-none invisible top-0 bottom-0 left-0 right-0 bg-black/40 ${
    isMenuOpen ? "!visible !opacity-100 pointer-events-auto" : ""
  }`;

  return (
    <>
      <div onClick={toggleStyles} className={backdropClasses}></div>
      <button
        ref={buttonRef}
        onMouseMove={callParallax}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onButtonClick}
        className="relative z-[60] flex flex-wrap justify-center items-center gap-5 transition-transform duration-200"
        aria-label="Menu"
      >
        <div
          data-magnetic
          className="Navmenu size-11 rounded-full flex justify-center items-center"
        >
          <div className="lineContainer flex flex-col gap-[.3rem] justify-between h-[9px] relative">
            <div className="line1 w-[25px] h-[1.5px] rounded-full bg-dark transition-all duration-300 ease-out"></div>
            <div className="line2 w-[25px] h-[1.5px] rounded-full bg-dark transition-all duration-300 ease-out"></div>
          </div>
        </div>
      </button>
    </>
  );
};

const Menu = ({ classes }) => {
  const { toggleStyles } = UseToggleStyles();

  const links = [
    { title: "Home", path: "/", icon: <FaHome /> },
    { title: "About", path: "/about", icon: <FaInfoCircle /> },
    { title: "Favorites", path: "/favorites", icon: <FaHeart /> },
  ];

  return (
    <div className={classes}>
      <div className="relative">
        <div className="flex flex-col lg:pr-24 text-3xl font-medium text-dark tracking-tight gap-6 justify-center">
          {links.map((link, index) => (
            <NavLink
              key={index}
              onClick={toggleStyles}
              className="link font-light flex items-center gap-2 transition-colors duration-200 hover:text-red-900"
              to={link.path}
            >
              {link.icon} {/* Icon and title now directly in line */}
              <span>{link.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

import { useLenis } from "@studio-freight/react-lenis";
import { useStore } from "../store/store";

export const UseToggleStyles = () => {
  const showMenu = useStore((state) => state.showMenu);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  const toggleStyles = () => {
    showMenu();
    document.querySelector(".line1").classList.toggle("rotate-45");
    document.querySelector(".line1").classList.toggle("absolute");
    document.querySelector(".line2").classList.toggle("top-[-4px]");
    document.querySelector(".line2").classList.toggle("-rotate-45");
    document.querySelector(".lineContainer").classList.toggle("h-[9px]");

    if (!isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  };

  return {
    toggleStyles,
  };
};

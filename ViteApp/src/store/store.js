import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create(
  devtools((set) => ({
    //Navbar Menu shi ==>
    isMenuOpen: false,
    showMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  }))
);

import { create } from "zustand";
import { UserDetails } from "../types/api/user/user.types";

interface UserState {
  user: UserDetails | null;

  setUser: (user: UserDetails | null) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user: UserDetails | null) =>
    set({
      user,
    }),

  clearAuth: () =>
    set({
      user: null,
    }),
}));

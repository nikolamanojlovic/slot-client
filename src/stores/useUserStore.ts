import { create } from "zustand";
import { UserDetails } from "../types/api/user/user.types";

const STORAGE_KEY = "slot-user";

const loadUser = (): UserDetails | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const saveUser = (user: UserDetails | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
};

interface UserState {
  user: UserDetails | null;
  setUser: (user: UserDetails | null) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: loadUser(),

  setUser: (user) => {
    saveUser(user);
    set({ user });
  },

  clearAuth: () => {
    saveUser(null);
    set({ user: null });
  },
}));

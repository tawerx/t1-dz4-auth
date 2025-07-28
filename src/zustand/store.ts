import { create } from "zustand";
import type { User } from "../types";

interface UserState {
  user: any;
  users: User[];
  setUser: (user: any) => void;
  setUsers: (users: User[]) => void;
}

export const useStore = create<UserState>((set) => ({
  user: null,
  users: [],
  setUser: (newUser: any) => set({ user: newUser }),
  setUsers: (newUsers: User[]) => set({ users: newUsers }),
}));

// auth hook to get user from access_token
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
  email: string;
  name: string;
};

export type AuthStore = {
  access_token: string;
  user: User;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      access_token: "",
      user: { email: "", name: "" },
      setAccessToken: (token: string) => {
        if (token === "") {
          set({ access_token: "", user: { email: "", name: "" }, isAuthenticated: false });

          return;
        }

        const user = jwtDecode<User>(token);

        set({ access_token: token, user, isAuthenticated: true });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

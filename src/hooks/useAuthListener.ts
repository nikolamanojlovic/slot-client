import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { getMe } from "../api/auth";
import { supabase } from "../lib/supabase";

export const useAuthListener = () => {
  const setUser = useUserStore((s) => s.setUser);
  const clearAuth = useUserStore((s) => s.clearAuth);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "INITIAL_SESSION" && !session) {
          clearAuth();
          return;
        }

        switch (event) {
          case "INITIAL_SESSION":
          case "SIGNED_IN":
          case "TOKEN_REFRESHED":
          case "USER_UPDATED":
            getMe()
              .then((response) => {
                setUser(response.data);
              })
              .catch(() => {
                if (event !== "INITIAL_SESSION") {
                  clearAuth();
                }
              });
            break;
          case "SIGNED_OUT":
            clearAuth();
            break;
          default:
            break;
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [setUser, clearAuth]);
};

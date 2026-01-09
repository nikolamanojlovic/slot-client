import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { getMe } from "../types/api/auth/auth.function";
import { supabase } from "../lib/supabase";

export const useAuthListener = () => {
  const setUser = useUserStore((s) => s.setUser);
  const clearAuth = useUserStore((s) => s.clearAuth);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        switch (event) {
          case "INITIAL_SESSION":
          case "SIGNED_IN":
          case "TOKEN_REFRESHED":
          case "USER_UPDATED":
            getMe()
              .then((response) => {
                setUser(response.data);
              })
              .catch((_error) => {
                console.error("User is not authenticated.");
                clearAuth();
              });
            break;
          case "SIGNED_OUT":
            console.log("User deleted");
            clearAuth();
            break;
          default:
            break;
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [setUser, clearAuth]);
};

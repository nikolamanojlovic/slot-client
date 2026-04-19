import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { getMe } from "../api/auth";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

const isSessionExpired = (session: Session): boolean => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return session.expires_at !== undefined && session.expires_at < nowInSeconds;
};

export const useAuthListener = () => {
  const setUser = useUserStore((s) => s.setUser);
  const clearAuth = useUserStore((s) => s.clearAuth);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "INITIAL_SESSION") {
          if (!session || isSessionExpired(session)) {
            supabase.auth.signOut();
            clearAuth();
            return;
          }
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
              .catch((_error) => {
                console.error("User is not authenticated.");
                clearAuth();
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

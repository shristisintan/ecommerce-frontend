import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  PropsWithChildren,
} from "react";

import * as authApi from "../api/authApi";

import type {
  AuthUser,
  LoginInput,
  RegisterBuyerInput,
  RegisterMerchantInput,
} from "../types/auth";

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface AuthContextValue {
  user: AuthUser | null;

  accessToken:
    | string
    | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (
    input: LoginInput
  ) => Promise<AuthUser>;

  registerBuyer: (
    input: RegisterBuyerInput
  ) => Promise<void>;

  registerMerchant: (
    input: RegisterMerchantInput
  ) => Promise<void>;

  logout: () => Promise<void>;
}

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

const TOKEN_KEY =
  "access_token";

/* =========================================================
   PROVIDER
========================================================= */

export const AuthProvider = ({
  children,
}: PropsWithChildren) => {
  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null
    );

  const [
    accessToken,
    setAccessToken,
  ] =
    useState<string | null>(
      () =>
        localStorage.getItem(
          TOKEN_KEY
        )
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* ======================================================
     SAVE TOKEN
  ====================================================== */

  const saveToken = (
    token: string
  ) => {
    localStorage.setItem(
      TOKEN_KEY,
      token
    );

    setAccessToken(
      token
    );
  };

  /* ======================================================
     CLEAR AUTH
  ====================================================== */

  const clearAuth = () => {
    localStorage.removeItem(
      TOKEN_KEY
    );

    setAccessToken(null);

    setUser(null);
  };

  /* ======================================================
     RESTORE SESSION
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    const restoreSession =
      async () => {
        try {
          setLoading(true);

          let token =
            localStorage.getItem(
              TOKEN_KEY
            );

          /*
           * First try current
           * access token.
           */

          if (token) {
            try {
              const currentUser =
                await authApi
                  .getCurrentUser(
                    token
                  );

              if (
                !cancelled
              ) {
                setUser(
                  currentUser
                );

                setAccessToken(
                  token
                );
              }

              return;
            } catch {
              /*
               * Access token may
               * be expired.
               *
               * Continue to
               * refresh token.
               */
            }
          }

          /*
           * Attempt refresh using
           * httpOnly refresh-token
           * cookie.
           */

          const refreshed =
            await authApi
              .refreshAccessToken();

          token =
            refreshed.accessToken;

          if (!token) {
            throw new Error(
              "Refresh response did not contain an access token."
            );
          }

          if (cancelled) {
            return;
          }

          saveToken(
            token
          );

          /*
           * Refresh normally
           * contains user data.
           */

          if (
            refreshed.user
          ) {
            setUser(
              refreshed.user
            );

            return;
          }

          /*
           * Fallback to /me.
           */

          const currentUser =
            await authApi
              .getCurrentUser(
                token
              );

          if (
            !cancelled
          ) {
            setUser(
              currentUser
            );
          }
        } catch {
          if (
            !cancelled
          ) {
            clearAuth();
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ======================================================
     LISTEN FOR API TOKEN EVENTS
  ====================================================== */

  useEffect(() => {
    const handleTokenRefreshed = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<string>;

      const newToken =
        customEvent.detail;

      if (!newToken) {
        return;
      }

      setAccessToken(
        newToken
      );
    };

    const handleSessionExpired =
      () => {
        localStorage.removeItem(
          TOKEN_KEY
        );

        setAccessToken(null);

        setUser(null);

        setLoading(false);
      };

    window.addEventListener(
      "auth:token-refreshed",
      handleTokenRefreshed
    );

    window.addEventListener(
      "auth:session-expired",
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        "auth:token-refreshed",
        handleTokenRefreshed
      );

      window.removeEventListener(
        "auth:session-expired",
        handleSessionExpired
      );
    };
  }, []);

  /* ======================================================
     LOGIN
  ====================================================== */

  const login = async (
    input: LoginInput
  ): Promise<AuthUser> => {
    setLoading(true);

    try {
      const result =
        await authApi.login(
          input
        );

      const token =
        result.accessToken;

      if (!token) {
        throw new Error(
          "Login response did not contain an access token."
        );
      }

      saveToken(
        token
      );

      let loggedInUser:
        AuthUser;

      if (result.user) {
        loggedInUser =
          result.user;
      } else {
        loggedInUser =
          await authApi
            .getCurrentUser(
              token
            );
      }

      setUser(
        loggedInUser
      );

      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     BUYER REGISTRATION
  ====================================================== */

  const registerBuyer =
    async (
      input: RegisterBuyerInput
    ) => {
      setLoading(true);

      try {
        const result =
          await authApi
            .registerBuyer(
              input
            );

        const token =
          result.accessToken;

        if (!token) {
          throw new Error(
            "Registration response did not contain an access token."
          );
        }

        saveToken(
          token
        );

        if (
          result.user
        ) {
          setUser(
            result.user
          );

          return;
        }

        const currentUser =
          await authApi
            .getCurrentUser(
              token
            );

        setUser(
          currentUser
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================================================
     MERCHANT REGISTRATION
  ====================================================== */

  const registerMerchant =
    async (
      input: RegisterMerchantInput
    ) => {
      setLoading(true);

      try {
        const result =
          await authApi
            .registerMerchant(
              input
            );

        const token =
          result.accessToken;

        if (!token) {
          throw new Error(
            "Registration response did not contain an access token."
          );
        }

        saveToken(
          token
        );

        if (
          result.user
        ) {
          setUser(
            result.user
          );

          return;
        }

        const currentUser =
          await authApi
            .getCurrentUser(
              token
            );

        setUser(
          currentUser
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================================================
     LOGOUT
  ====================================================== */

  const logout =
    async () => {
      try {
        await authApi.logout(
          accessToken
        );
      } finally {
        clearAuth();

        /*
         * Explicit logout can
         * remove unfinished
         * checkout information.
         */

        localStorage.removeItem(
          "pending_order_id"
        );

        localStorage.removeItem(
          "checkout_form_data"
        );

        setLoading(false);
      }
    };

  /* ======================================================
     AUTH STATE
  ====================================================== */

  const isAuthenticated =
    Boolean(
      user &&
        accessToken
    );

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated,

        login,
        registerBuyer,
        registerMerchant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   AUTH HOOK
========================================================= */

export const useAuth =
  (): AuthContextValue => {
    const context =
      useContext(
        AuthContext
      );

    if (!context) {
      throw new Error(
        "useAuth must be used inside AuthProvider"
      );
    }

    return context;
  };
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
} from "../types/auth";

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

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

const TOKEN_KEY =
  "access_token";

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

  /*
   * Save access token both
   * in localStorage and React state.
   */
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

  /*
   * Clears authentication only.
   *
   * IMPORTANT:
   * Do NOT remove pending_order_id
   * here.
   *
   * If authentication temporarily
   * fails while a payment is pending,
   * we still need the existing order
   * for payment recovery.
   */
  const clearAuth = () => {
    localStorage.removeItem(
      TOKEN_KEY
    );

    setAccessToken(null);
    setUser(null);
  };

  /*
   * =====================================================
   * RESTORE SESSION AFTER PAGE REFRESH
   * =====================================================
   *
   * Flow:
   *
   * Existing access token
   *       ↓
   * Try /auth/me
   *       ↓
   * If expired
   *       ↓
   * Try refresh token
   *       ↓
   * Store new access token
   */
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
           * First try existing
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
               * have expired.
               *
               * Continue to refresh.
               */
            }
          }

          /*
           * Use refresh-token cookie.
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
           * Refresh response already
           * contains the user.
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
           * Fallback:
           * load user from /auth/me.
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

  /*
   * =====================================================
   * LISTEN FOR AUTOMATIC API TOKEN REFRESH
   * =====================================================
   *
   * apiClient.ts dispatches:
   *
   * auth:token-refreshed
   *
   * when a 401 is successfully
   * recovered using the refresh token.
   *
   * It dispatches:
   *
   * auth:session-expired
   *
   * only when the refresh token
   * itself is no longer valid.
   */
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

      /*
       * apiClient already updates
       * localStorage.
       *
       * We update React state here
       * so AuthContext stays synced.
       */
      setAccessToken(
        newToken
      );
    };

    const handleSessionExpired =
      () => {
        /*
         * Refresh token has also
         * expired or become invalid.
         *
         * Now the user must log in.
         */
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

  /*
   * =====================================================
   * LOGIN
   * =====================================================
   */
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

  /*
   * =====================================================
   * BUYER REGISTRATION
   * =====================================================
   */
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

  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */
  const logout =
    async () => {
      try {
        await authApi.logout(
          accessToken
        );
      } finally {
        /*
         * Explicit logout means we
         * can clear both authentication
         * and unfinished checkout data.
         */
        clearAuth();

        localStorage.removeItem(
          "pending_order_id"
        );

        localStorage.removeItem(
          "checkout_form_data"
        );

        setLoading(false);
      }
    };

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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

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
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
  ) => Promise<void>;

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
   * IMPORTANT:
   *
   * This should clear authentication only.
   *
   * Do NOT remove pending_order_id here
   * because this function is also used
   * when restoring authentication fails.
   *
   * Payment recovery must still be able
   * to access the existing pending order.
   */
  const clearAuth = () => {
    localStorage.removeItem(
      TOKEN_KEY
    );

    setAccessToken(null);
    setUser(null);
  };

  /*
   * Restore login after browser refresh.
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
           * First try the existing
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
               * Try refresh token
               * before logging out.
               */
            }
          }

          /*
           * Rotate refresh token.
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
           * Some backend responses
           * already return user info.
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
           * Otherwise request /auth/me
           * using the new access token.
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

  const login = async (
    input: LoginInput
  ) => {
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

  const logout =
    async () => {
      try {
        await authApi.logout(
          accessToken
        );
      } finally {
        /*
         * User explicitly logged out,
         * so now it is safe to clear
         * checkout-related local data.
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
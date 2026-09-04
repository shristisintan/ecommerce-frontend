import type {
  AuthData,
  AuthUser,
  LoginInput,
  RegisterBuyerInput,
  RegisterMerchantInput,
} from "../types/auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

/* =========================================================
   RESPONSE PARSER
========================================================= */

const parseResponse = async (
  response: Response
) => {
  const result =
    await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Something went wrong"
    );
  }

  return result;
};

/* =========================================================
   LOGIN
========================================================= */

export const login = async (
  input: LoginInput
): Promise<AuthData> => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        input
      ),
    }
  );

  const result =
    await parseResponse(
      response
    );

  return result.data;
};

/* =========================================================
   BUYER REGISTRATION
========================================================= */

export const registerBuyer =
  async (
    input: RegisterBuyerInput
  ): Promise<AuthData> => {
    const response =
      await fetch(
        `${API_URL}/auth/register/buyer`,
        {
          method: "POST",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            input
          ),
        }
      );

    const result =
      await parseResponse(
        response
      );

    return result.data;
  };

/* =========================================================
   MERCHANT REGISTRATION
========================================================= */

export const registerMerchant =
  async (
    input: RegisterMerchantInput
  ): Promise<AuthData> => {
    const response =
      await fetch(
        `${API_URL}/auth/register/merchant`,
        {
          method: "POST",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            input
          ),
        }
      );

    const result =
      await parseResponse(
        response
      );

    return result.data;
  };

/* =========================================================
   CURRENT USER
========================================================= */

export const getCurrentUser =
  async (
    accessToken: string
  ): Promise<AuthUser> => {
    const response =
      await fetch(
        `${API_URL}/auth/me`,
        {
          method: "GET",

          credentials:
            "include",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    const result =
      await parseResponse(
        response
      );

    /*
     * Supports:
     *
     * data: user
     *
     * or
     *
     * data: {
     *   user
     * }
     */

    return (
      result.data?.user ??
      result.data
    );
  };

/* =========================================================
   REFRESH TOKEN
========================================================= */

/*
 * React StrictMode can run
 * effects more than once
 * during development.
 *
 * Since the backend rotates
 * refresh tokens, prevent
 * simultaneous refresh calls.
 */

let refreshPromise:
  | Promise<AuthData>
  | null = null;

export const refreshAccessToken =
  async (): Promise<AuthData> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise =
      (async () => {
        const response =
          await fetch(
            `${API_URL}/auth/refresh`,
            {
              method:
                "POST",

              credentials:
                "include",
            }
          );

        const result =
          await parseResponse(
            response
          );

        return result.data;
      })();

    try {
      return await refreshPromise;
    } finally {
      refreshPromise = null;
    }
  };

/* =========================================================
   LOGOUT
========================================================= */

export const logout = async (
  accessToken?:
    | string
    | null
): Promise<void> => {
  try {
    await fetch(
      `${API_URL}/auth/logout`,
      {
        method: "POST",

        credentials:
          "include",

        headers:
          accessToken
            ? {
                Authorization:
                  `Bearer ${accessToken}`,
              }
            : undefined,
      }
    );
  } catch (error) {
    console.error(
      "Logout request failed:",
      error
    );
  }
};
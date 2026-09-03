import type {
  AuthData,
  AuthUser,
  LoginInput,
  RegisterBuyerInput,
} from "../types/auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

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

      body: JSON.stringify(input),
    }
  );

  const result =
    await parseResponse(
      response
    );

  return result.data;
};

export const registerBuyer =
  async (
    input: RegisterBuyerInput
  ): Promise<AuthData> => {
    const response = await fetch(
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

export const getCurrentUser =
  async (
    accessToken: string
  ): Promise<AuthUser> => {
    const response = await fetch(
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
     * Supports either:
     *
     * data: user
     *
     * or:
     *
     * data: {
     *   user: user
     * }
     */
    return (
      result.data?.user ??
      result.data
    );
  };

/*
 * Very important:
 *
 * React StrictMode may run effects
 * twice while developing.
 *
 * Since your backend ROTATES refresh
 * tokens, two simultaneous refresh
 * calls can cause problems.
 *
 * This ensures only one refresh request
 * can run at a time.
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
              method: "POST",

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
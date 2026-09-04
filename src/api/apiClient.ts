import {
  refreshAccessToken,
} from "./authApi";

const TOKEN_KEY =
  "access_token";

/*
 * Shared authenticated fetch helper.
 *
 * Flow:
 *
 * API request
 * → access token expired
 * → backend returns 401
 * → refresh token endpoint called
 * → new access token saved
 * → original request retried once
 */
export const authenticatedFetch =
  async (
    input: RequestInfo | URL,
    init: RequestInit = {}
  ): Promise<Response> => {
    const token =
      localStorage.getItem(
        TOKEN_KEY
      );

    const headers =
      new Headers(
        init.headers
      );

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    /*
     * First API attempt
     */
    let response =
      await fetch(
        input,
        {
          ...init,

          credentials:
            "include",

          headers,
        }
      );

    /*
     * Token is still valid.
     */
    if (
      response.status !== 401
    ) {
      return response;
    }

    /*
     * Access token expired.
     *
     * Try refresh token.
     */
    try {
      const refreshed =
        await refreshAccessToken();

      const newToken =
        refreshed.accessToken;

      if (!newToken) {
        throw new Error(
          "Refresh did not return an access token"
        );
      }

      /*
       * Save new access token.
       */
      localStorage.setItem(
        TOKEN_KEY,
        newToken
      );

      /*
       * Tell AuthContext that
       * the access token changed.
       */
      window.dispatchEvent(
        new CustomEvent(
          "auth:token-refreshed",
          {
            detail:
              newToken,
          }
        )
      );

      /*
       * Retry original request
       * using new access token.
       */
      headers.set(
        "Authorization",
        `Bearer ${newToken}`
      );

      response =
        await fetch(
          input,
          {
            ...init,

            credentials:
              "include",

            headers,
          }
        );

      return response;
    } catch {
      /*
       * Refresh token also expired
       * or became invalid.
       *
       * Only then should the user
       * need to login again.
       */
      localStorage.removeItem(
        TOKEN_KEY
      );

      window.dispatchEvent(
        new Event(
          "auth:session-expired"
        )
      );

      return response;
    }
  };
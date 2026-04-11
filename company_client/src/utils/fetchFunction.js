// src/utils/fetchFunction.js
import { COMPANY_REFRESH_TOKEN_URL } from "./constants";

export default async function fetchFunction({
  crudMethod,
  apiUrl,
  postData,
  setError,
}) {
  try {
    let accessToken = localStorage.getItem("companyAccessToken");
    let refreshToken = localStorage.getItem("companyRefreshToken");

    const headers = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      headers["refresh-token"] = refreshToken;
    }

    let response = await fetch(apiUrl, {
      method: crudMethod,
      headers,
      ...(["POST", "PUT", "PATCH"].includes(crudMethod)
        ? { body: JSON.stringify(postData) }
        : {}),
    });

    if (response.status !== 401) {
      const result = await response.json();
      if (!response.ok) {
        setError?.(result?.message || result?.error || "Something went wrong");
      }
      return result;
    }

    // Token expired - try refresh
    console.warn("Access token expired → Refreshing...");

    const refreshResponse = await fetch(COMPANY_REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "refresh-token": refreshToken,
      },
    });

    const refreshResult = await refreshResponse.json();

    if (!refreshResponse.ok || refreshResult?.status !== "success") {
      console.error("Refresh token failed!");
      localStorage.removeItem("companyAccessToken");
      localStorage.removeItem("companyRefreshToken");
      localStorage.removeItem("companyUser");
      window.location.href = "/login";
      return;
    }

    const newAccessToken =
      refreshResult.accessToken ||
      refreshResult.token?.accessToken;

    if (!newAccessToken) {
      console.error("No access token in refresh response");
      localStorage.removeItem("companyAccessToken");
      localStorage.removeItem("companyRefreshToken");
      localStorage.removeItem("companyUser");
      window.location.href = "/login";
      return;
    }

    localStorage.setItem("companyAccessToken", newAccessToken);
    accessToken = newAccessToken;

    // Retry original request
    const retryResponse = await fetch(apiUrl, {
      method: crudMethod,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "refresh-token": refreshToken,
      },
      ...(["POST", "PUT", "PATCH"].includes(crudMethod)
        ? { body: JSON.stringify(postData) }
        : {}),
    });

    const retryResult = await retryResponse.json();
    if (!retryResponse.ok) {
      setError?.(retryResult?.message  || retryResult?.error|| "Something went wrong");
    }
    return retryResult;
  } catch (error) {
    console.error("Fetch Error:", error);
    setError?.(error.message);
  }
}

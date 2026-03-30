// src/utils/fetchFunction.js
import { REFRESH_TOKEN_URL } from "./constants";

export default async function fetchFunction({
  crudMethod,
  apiUrl,
  postData,
  setError,
}) {
  try {
    // Get tokens from localStorage
    let accessToken = localStorage.getItem("aiInterviewerAccessToken");
    let refreshToken = localStorage.getItem("aiInterviewerRefreshToken");

    // Prepare headers to include tokens
    const headers = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      headers["refresh-token"] = refreshToken;
    }

    // First API call attempt
    let response = await fetch(apiUrl, {
      method: crudMethod,
      headers,
      ...(crudMethod === "POST" || crudMethod === "PUT"
        ? { body: JSON.stringify(postData) }
        : {}),
    });

    // If success → return normally
    if (response.status !== 401) {
      const result = await response.json();
      if (!response.ok) {
        setError?.(result?.message || "Something went wrong");
      }
      return result;
    }

    // If 401 → token expired → refresh it
    console.warn("Access token expired → Refreshing token...");

    const refreshResponse = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "refresh-token": refreshToken,
      },
    });

    const refreshResult = await refreshResponse.json();

    // If refresh failed → logout user
    if (!refreshResponse.ok || refreshResult?.status !== "success") {
      console.error("Refresh token failed!");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    // Save new access token (handle both shapes)
    const newAccessToken =
      refreshResult.accessToken || refreshResult.tokens?.accessToken;

    if (!newAccessToken) {
      console.error("No access token in refresh response");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    localStorage.setItem("aiInterviewerAccessToken", newAccessToken);
    accessToken = newAccessToken;

    // Retry original API request with new token
    const retryHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "refresh-token": refreshToken,
    };

    const retryResponse = await fetch(apiUrl, {
      method: crudMethod,
      headers: retryHeaders,
      ...(crudMethod === "POST" || crudMethod === "PUT"
        ? { body: JSON.stringify(postData) }
        : {}),
    });

    const retryResult = await retryResponse.json();

    if (!retryResponse.ok) {
      setError?.(retryResult?.message || "Something went wrong");
    }

    return retryResult;
  } catch (error) {
    console.error("Fetch Error:", error);
    setError?.(error.message);
  }
}
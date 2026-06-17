import { toast } from "react-toastify";
import type { ApiResponse } from "../types/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

let refreshPromise: Promise<boolean> | null = null;

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers = new Headers(options.headers);

  const isSilent = headers.get("X-Silent-Check") === "true";
  headers.delete("X-Silent-Check");

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    let response = await fetch(url, config);

    if (response.status === 401 && !url.includes("/authentication/refresh-token")) {

      if (isSilent) {
        throw new Error("Guest user");
      }

      if (!refreshPromise) {
        refreshPromise = processRefreshToken();
      }

      const refreshSuccess = await refreshPromise;

      if (refreshSuccess) {
        response = await fetch(url, config);

        if (response.status === 401) {
          handleLogout();
          throw new Error("Oturum süresi doldu.");
        }
      } else {
        handleLogout();
        throw new Error("Oturum süresi doldu.");
      }
    }

    const responseText = await response.text();
    let result: ApiResponse<T>;

    try {
      result = responseText
        ? JSON.parse(responseText)
        : {
          success: response.ok,
          message: response.ok ? "" : "Sunucudan içerik dönmedi.",
          data: null as T,
          statusCode: response.status
        };
    } catch {
      result = {
        success: false,
        message: "Sunucu yanıtı okunamadı (Geçersiz format).",
        data: null as T,
        statusCode: response.status
      };
    }

    if (!response.ok) {

      if (!isSilent) {
        handleApiError(result);
      }
      throw result;
    }

    if (options.method && options.method !== "GET" && result.message) {
      toast.success(result.message);
    }

    return result;

  } catch (error: unknown) {

    if (isSilent) {
      throw error;
    }

    const isApiResponse = (err: unknown): err is ApiResponse<T> => {
      return (
        err !== null &&
        typeof err === 'object' &&
        'success' in err &&
        'statusCode' in err
      );
    };

    if (isApiResponse(error) && !error.success) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : "Sunucuya bağlanılamadı.";
    toast.error(errorMessage);
    throw error;
  }
};

const processRefreshToken = async (): Promise<boolean> => {
  try {
    const refreshResponse = await fetch(`${BASE_URL}/authentication/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    return refreshResponse.ok;
  } catch {
    return false;
  } finally {
    refreshPromise = null;
  }
};

export const handleLogout = () => {

  if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
    fetch(`${BASE_URL}/authentication/revoke-refresh-token`, {
      method: "POST",
      credentials: "include"
    }).finally(() => {
      window.location.href = "/login";
    });
  }
};

const handleApiError = (errorResponse: ApiResponse<unknown>) => {
  const { statusCode, message, errors } = errorResponse;

  switch (statusCode) {
    case 401:
      break;
    case 403:
      toast.error("Bu işlem için yetkiniz bulunmamaktadır.");
      break;
    case 400:
      if (errors && errors.length > 0) {
        errors.forEach((err) => toast.error(err));
      } else {
        toast.error(message || "Hatalı istek.");
      }
      break;
    case 404:
      toast.warning(message || "Kayıt bulunamadı.");
      break;
    case 500:
      toast.error("Sunucu tarafında bir hata oluştu.");
      break;
    default:
      toast.error(message || "Bir hata oluştu.");
      break;
  }
};
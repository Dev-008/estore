/**
 * Centralized API client for all HTTP requests
 * Handles error handling, request/response transformation, and logging
 */

import { NetworkError, AppError } from "./errors";
import Logger from "./logger";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 10000; // 10 seconds

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || "http://localhost:5000";
  }

  private getHeaders(headers?: Record<string, string>): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...headers,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.message || `API Error: ${response.statusText}`;
      throw new NetworkError(message, response.status);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string, config?: Omit<RequestConfig, "method" | "body">): Promise<T> {
    return this.request<T>(path, { ...config, method: "GET" });
  }

  async post<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "method">): Promise<T> {
    return this.request<T>(path, { ...config, method: "POST", body });
  }

  async put<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "method">): Promise<T> {
    return this.request<T>(path, { ...config, method: "PUT", body });
  }

  async delete<T>(path: string, config?: Omit<RequestConfig, "method" | "body">): Promise<T> {
    return this.request<T>(path, { ...config, method: "DELETE" });
  }

  private async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { method = "GET", headers, body, timeout = this.defaultTimeout } = config;
    const url = `${this.baseUrl}${path}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      Logger.info(`API Request: ${method} ${url}`);

      const fetchOptions: RequestInit = {
        method,
        headers: this.getHeaders(headers),
        signal: controller.signal,
      };

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      const data = await this.handleResponse<T>(response);

      Logger.info(`API Response: ${method} ${url}`, data);
      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        Logger.error(`API Timeout: ${method} ${url}`);
        throw new NetworkError("Request timeout", 408);
      }

      if (error instanceof NetworkError) {
        Logger.error(`API Error: ${method} ${url}`, error);
        throw error;
      }

      Logger.error(`API Error: ${method} ${url}`, error);
      throw new AppError(error instanceof Error ? error.message : "Unknown API error");
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Lazy singleton pattern
let instance: ApiClient | null = null;

function getApiClient(): ApiClient {
  if (!instance) {
    instance = new ApiClient();
  }
  return instance;
}

export default getApiClient();

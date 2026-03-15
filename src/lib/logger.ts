/**
 * Logging utility for consistent error and warning reporting
 */

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private static isDevelopment = import.meta.env.DEV;

  private static formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  static info(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage("info", message), data);
    }
  }

  static warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage("warn", message), data);
  }

  static error(message: string, error?: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(this.formatMessage("error", message), errorMessage);
  }

  static group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  static groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
}

export default Logger;

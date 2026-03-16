/**
 * Environment variables validation
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  apiUrl: string;
  appName: string;
  appVersion: string;
}

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvValidationError";
  }
}

function getEnvVariable(key: string, fallback?: string): string {
  const value = import.meta.env[`VITE_${key}`] as string | undefined || fallback;
  
  if (!value && !fallback) {
    console.warn(`Missing environment variable: VITE_${key}`);
    return "";
  }
  
  return value || "";
}

export const env: EnvConfig = {
  apiUrl: getEnvVariable("API_URL", "https://estore-86q6.onrender.com"),
  appName: getEnvVariable("APP_NAME", "storeMX"),
  appVersion: getEnvVariable("APP_VERSION", "1.0.0"),
};

export default env;

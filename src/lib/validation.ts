/**
 * Input validation utilities
 */

import { ValidationError } from "./errors";

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

export function validateZipCode(zip: string): boolean {
  return zip.length >= 5 && /^[0-9]+$/.test(zip);
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCheckoutForm(data: {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  paymentMethod?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!validateName(data.name)) {
    errors.name = "Name must be between 2 and 100 characters";
  }

  if (!validateEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  if (data.address.trim().length < 5) {
    errors.address = "Address must be at least 5 characters";
  }

  if (data.city.trim().length < 2) {
    errors.city = "City is required";
  }

  if (!validateZipCode(data.zip)) {
    errors.zip = "Invalid zip code (minimum 5 digits)";
  }

  if (!validatePhone(data.phone)) {
    errors.phone = "Invalid phone number (minimum 10 digits)";
  }

  if (!data.paymentMethod || data.paymentMethod.trim().length === 0) {
    errors.paymentMethod = "Please select a payment method";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

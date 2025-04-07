// src/utils/validation.ts

export const isValidName = (value: string): boolean => value.trim().length > 0;
export const isValidAddress = (value: string): boolean => value.trim().length > 0;
export const isValidCity = (value: string): boolean => value.trim().length > 0;
export const isValidPostalCode = (value: string): boolean => /^\d+$/.test(value.trim());
export const isValidCardNumber = (value: string): boolean => /^\d{16}$/.test(value.replace(/\s/g, ''));
export const isValidExpiryDate = (value: string): boolean => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim());
export const isValidCvv = (value: string): boolean => /^\d{3,4}$/.test(value.trim());
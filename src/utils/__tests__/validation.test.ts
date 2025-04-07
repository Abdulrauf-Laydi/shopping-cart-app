// src/utils/__tests__/validation.test.ts
import {
    isValidName,
    isValidAddress,
    isValidCity,
    isValidPostalCode,
    isValidCardNumber,
    isValidExpiryDate,
    isValidCvv
} from '../validation'; // Adjust path if necessary

describe('Validation Utilities', () => {

    // Test isValidName
    describe('isValidName', () => {
        it('should return true for non-empty strings', () => {
            expect(isValidName('John Doe')).toBe(true);
        });
        it('should return true for strings with spaces', () => {
            expect(isValidName('  Jane Smith  ')).toBe(true);
        });
        it('should return false for empty strings', () => {
            expect(isValidName('')).toBe(false);
        });
        it('should return false for strings with only spaces', () => {
            expect(isValidName('   ')).toBe(false);
        });
    });

    // Test isValidCardNumber
    describe('isValidCardNumber', () => {
        it('should return true for 16 digits', () => {
            expect(isValidCardNumber('1111222233334444')).toBe(true);
        });
        it('should return true for 16 digits with spaces', () => {
            expect(isValidCardNumber('1111 2222 3333 4444')).toBe(true);
        });
        it('should return false for less than 16 digits', () => {
            expect(isValidCardNumber('123456789012345')).toBe(false);
        });
        it('should return false for more than 16 digits', () => {
            expect(isValidCardNumber('11112222333344445')).toBe(false);
        });
        it('should return false for non-digit characters', () => {
            expect(isValidCardNumber('111122223333444a')).toBe(false);
        });
        it('should return false for empty string', () => {
            expect(isValidCardNumber('')).toBe(false);
        });
    });

    // Test isValidExpiryDate
    describe('isValidExpiryDate', () => {
        it('should return true for valid MM/YY format', () => {
            expect(isValidExpiryDate('12/25')).toBe(true);
            expect(isValidExpiryDate('01/28')).toBe(true);
        });
        it('should return false for invalid month (>12)', () => {
            expect(isValidExpiryDate('13/25')).toBe(false);
        });
        it('should return false for invalid month (00)', () => {
            expect(isValidExpiryDate('00/25')).toBe(false);
        });
        it('should return false for invalid format (MMYY)', () => {
            expect(isValidExpiryDate('1225')).toBe(false);
        });
        it('should return false for invalid format (M/YY)', () => {
            expect(isValidExpiryDate('1/25')).toBe(false);
        });
        it('should return false for invalid format (MM/Y)', () => {
            expect(isValidExpiryDate('12/5')).toBe(false);
        });
        it('should return false for empty string', () => {
            expect(isValidExpiryDate('')).toBe(false);
        });
    });

     // Test isValidCvv
    describe('isValidCvv', () => {
        it('should return true for 3 digits', () => {
            expect(isValidCvv('123')).toBe(true);
        });
        it('should return true for 4 digits', () => {
            expect(isValidCvv('1234')).toBe(true);
        });
         it('should return false for less than 3 digits', () => {
            expect(isValidCvv('12')).toBe(false);
        });
         it('should return false for more than 4 digits', () => {
            expect(isValidCvv('12345')).toBe(false);
        });
         it('should return false for non-digits', () => {
            expect(isValidCvv('12a')).toBe(false);
        });
         it('should return false for empty string', () => {
            expect(isValidCvv('')).toBe(false);
        });
    });

    // Add similar tests for isValidAddress, isValidCity, isValidPostalCode
});
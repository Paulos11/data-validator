"use strict";
// src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValidator = void 0;
class DataValidator {
    constructor(schema) {
        this.schema = schema;
    }
    validate(data) {
        const errors = [];
        const validatedData = {};
        for (const [field, rules] of Object.entries(this.schema)) {
            const value = data[field];
            try {
                validatedData[field] = this.validateField(field, value, rules);
            }
            catch (error) {
                if (error instanceof Error) {
                    errors.push(error.message);
                }
                else {
                    errors.push(`Validation failed for field: ${field}`);
                }
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            validatedData,
        };
    }
    validateField(field, value, rules) {
        // Required check
        if (rules.required &&
            (value === undefined || value === null || value === "")) {
            throw new Error(`${field} is required`);
        }
        // Skip validation if field is not required and empty
        if (!rules.required &&
            (value === undefined || value === null || value === "")) {
            return value;
        }
        // Type validation
        if (rules.type) {
            this.validateType(field, value, rules.type);
        }
        // String validations
        if (rules.type === "string") {
            this.validateString(field, value, rules);
        }
        // Number validations
        if (rules.type === "number") {
            this.validateNumber(field, value, rules);
        }
        // Enum validation
        if (rules.enum && !rules.enum.includes(value)) {
            throw new Error(`${field} must be one of: ${rules.enum.join(", ")}`);
        }
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            throw new Error(`${field} format is invalid`);
        }
        // Nested object validation
        if (rules.nested && typeof value === "object") {
            const nestedValidator = new DataValidator(rules.nested);
            const nestedResult = nestedValidator.validate(value);
            if (!nestedResult.isValid) {
                throw new Error(`${field}: ${nestedResult.errors.join(", ")}`);
            }
            return nestedResult.validatedData;
        }
        // Custom validation
        if (rules.custom) {
            const customError = rules.custom(value);
            if (customError) {
                throw new Error(customError);
            }
        }
        return value;
    }
    validateType(field, value, type) {
        const actualType = Array.isArray(value) ? "array" : typeof value;
        if (actualType !== type) {
            throw new Error(`${field} must be of type ${type}`);
        }
    }
    validateString(field, value, rules) {
        if (rules.minLength && value.length < rules.minLength) {
            throw new Error(`${field} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
            throw new Error(`${field} must not exceed ${rules.maxLength} characters`);
        }
    }
    validateNumber(field, value, rules) {
        if (rules.min !== undefined && value < rules.min) {
            throw new Error(`${field} must be greater than or equal to ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
            throw new Error(`${field} must be less than or equal to ${rules.max}`);
        }
    }
}
exports.DataValidator = DataValidator;

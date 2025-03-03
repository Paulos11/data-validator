// src/index.ts

export interface ValidationRule {
  required?: boolean;
  type?: "string" | "number" | "boolean" | "object" | "array";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
  enum?: any[];
  nested?: ValidationSchema;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData: any;
}

export class DataValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  public validate(data: any): ValidationResult {
    const errors: string[] = [];
    const validatedData: any = {};

    for (const [field, rules] of Object.entries(this.schema)) {
      const value = data[field];

      try {
        validatedData[field] = this.validateField(field, value, rules);
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error.message);
        } else {
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

  private validateField(field: string, value: any, rules: ValidationRule): any {
    // Required check
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      throw new Error(`${field} is required`);
    }

    // Skip validation if field is not required and empty
    if (
      !rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      return value;
    }

    // Type validation
    if (rules.type) {
      this.validateType(field, value, rules.type);
    }

    // String validations
    if (rules.type === "string") {
      this.validateString(field, value as string, rules);
    }

    // Number validations
    if (rules.type === "number") {
      this.validateNumber(field, value as number, rules);
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

  private validateType(field: string, value: any, type: string): void {
    const actualType = Array.isArray(value) ? "array" : typeof value;
    if (actualType !== type) {
      throw new Error(`${field} must be of type ${type}`);
    }
  }

  private validateString(
    field: string,
    value: string,
    rules: ValidationRule
  ): void {
    if (rules.minLength && value.length < rules.minLength) {
      throw new Error(
        `${field} must be at least ${rules.minLength} characters`
      );
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      throw new Error(`${field} must not exceed ${rules.maxLength} characters`);
    }
  }

  private validateNumber(
    field: string,
    value: number,
    rules: ValidationRule
  ): void {
    if (rules.min !== undefined && value < rules.min) {
      throw new Error(`${field} must be greater than or equal to ${rules.min}`);
    }
    if (rules.max !== undefined && value > rules.max) {
      throw new Error(`${field} must be less than or equal to ${rules.max}`);
    }
  }
}


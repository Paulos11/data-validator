interface ValidationRule {
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
interface ValidationSchema {
    [key: string]: ValidationRule;
}
interface ValidationResult {
    isValid: boolean;
    errors: string[];
    validatedData: any;
}
declare class DataValidator {
    private schema;
    constructor(schema: ValidationSchema);
    validate(data: any): ValidationResult;
    private validateField;
    private validateType;
    private validateString;
    private validateNumber;
}
export { DataValidator, ValidationRule, ValidationSchema, ValidationResult };

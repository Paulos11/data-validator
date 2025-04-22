// tests/validator.test.ts
import { DataValidator } from "../src/index";

describe("DataValidator", () => {
  test("basic validation works", () => {
    const validator = new DataValidator({
      name: {
        type: "string",
        required: true,
        minLength: 2,
      },
      age: {
        type: "number",
        min: 0,
        max: 120,
      },
    });

    const validData = {
      name: "John",
      age: 25,
    };

    const result = validator.validate(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("detects invalid data", () => {
    const validator = new DataValidator({
      email: {
        type: "string",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    });

    const invalidData = {
      email: "not-an-email",
    };

    const result = validator.validate(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  test("required field validation", () => {
    const validator = new DataValidator({
      name: {
        type: "string",
        required: true,
      },
    });

    const missingData = {};
    const result = validator.validate(missingData);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain("required");
  });

  test("skips validation for optional empty fields", () => {
    const validator = new DataValidator({
      name: {
        type: "string",
        required: false,
      },
    });

    const emptyData = { name: "" };
    const result = validator.validate(emptyData);
    expect(result.isValid).toBe(true);
  });

  test("string length validation", () => {
    const validator = new DataValidator({
      shortString: {
        type: "string",
        minLength: 5,
      },
      longString: {
        type: "string",
        maxLength: 3,
      },
    });

    const invalidData = {
      shortString: "abc",
      longString: "abcde",
    };

    const result = validator.validate(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toContain("at least 5 characters");
    expect(result.errors[1]).toContain("not exceed 3 characters");
  });

  test("number range validation", () => {
    const validator = new DataValidator({
      tooSmall: {
        type: "number",
        min: 10,
      },
      tooBig: {
        type: "number",
        max: 20,
      },
    });

    const invalidData = {
      tooSmall: 5,
      tooBig: 25,
    };

    const result = validator.validate(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toContain("greater than or equal to 10");
    expect(result.errors[1]).toContain("less than or equal to 20");
  });

  test("type validation", () => {
    const validator = new DataValidator({
      number: {
        type: "number",
      },
      string: {
        type: "string",
      },
      boolean: {
        type: "boolean",
      },
      object: {
        type: "object",
      },
      array: {
        type: "array",
      },
    });

    const invalidData = {
      number: "not a number",
      string: 123,
      boolean: "not a boolean",
      object: [],
      array: {},
    };

    const result = validator.validate(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(5);
    expect(result.errors.every(error => error.includes("must be of type"))).toBe(true);
  });

  test("enum validation", () => {
    const validator = new DataValidator({
      color: {
        type: "string",
        enum: ["red", "green", "blue"],
      },
    });

    const invalidData = {
      color: "yellow",
    };

    const result = validator.validate(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain("must be one of: red, green, blue");
  });

  test("nested object validation", () => {
    const validator = new DataValidator({
      user: {
        type: "object",
        nested: {
          name: { type: "string", required: true },
          age: { type: "number", min: 18 },
        },
      },
    });

    const invalidData = {
      user: {
        name: "Test",
        age: 15,
      },
    };

    const result = validator.validate(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain("user:");
    expect(result.errors[0]).toContain("greater than or equal to 18");
  });

  test("custom validation function", () => {
    const validator = new DataValidator({
      password: {
        type: "string",
        custom: (value) => {
          if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
          }
          if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number";
          }
        },
      },
    });

    const invalidData = {
      password: "password",
    };

    const result = validator.validate(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain("uppercase letter");
  });

  test("handles unknown error types", () => {
    const validator = new DataValidator({
      test: {
        custom: () => {
          throw "Not an Error object";
        },
      },
    });

    const data = { test: "anything" };
    const result = validator.validate(data);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain("Validation failed for field: test");
  });
});

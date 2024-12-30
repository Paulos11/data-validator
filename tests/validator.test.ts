// tests/validator.test.ts
import { DataValidator } from "../src";

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
});

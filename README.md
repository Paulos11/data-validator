# TypeScript Data Validator

A lightweight, type-safe validation library for TypeScript/JavaScript applications.

## Features

- 🚀 Type-safe validation schemas
- 💪 Built-in validators for common types
- 🔄 Nested object validation
- 📝 Custom validation rules
- 0️⃣ Zero dependencies

## Installation

```bash
# Using npm
npm install @sunillakandri/data-validator

# Using Bun
bun add @sunillakandri/data-validator
```

## Quick Start

```typescript
import { DataValidator } from "@sunillakandri/data-validator";

// Define schema
const schema = {
  username: {
    type: "string",
    required: true,
    minLength: 3,
  },
  email: {
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

// Create validator
const validator = new DataValidator(schema);

// Validate data
const result = validator.validate({
  username: "john_doe",
  email: "john@example.com",
});
```

## Validation Rules

- `required`: Field must be present
- `type`: Type validation ('string', 'number', 'boolean', 'object', 'array')
- `minLength`/`maxLength`: String length limits
- `min`/`max`: Number value limits
- `pattern`: RegExp pattern matching
- `custom`: Custom validation function
- `nested`: Nested object schema

## Example: Custom Validation

```typescript
const schema = {
  password: {
    type: "string",
    custom: (value) => {
      if (!/[A-Z]/.test(value)) {
        return "Need one uppercase letter";
      }
      if (!/[0-9]/.test(value)) {
        return "Need one number";
      }
    },
  },
};
```

## Development

This project uses [Bun](https://bun.sh) for development, testing, and building.

### Setup

```bash
# Install dependencies
bun install
```

### Development Commands

```bash
# Build the project
bun run build

# Run tests
bun run test
```

## License

MIT © Sunil Lakandri

---

Made by [Sunil Lakandri](https://github.com/Paulos11)

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};

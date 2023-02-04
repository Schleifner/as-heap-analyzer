import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  roots: ["tests-ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage-ts",
  collectCoverage: true,
};
export default config;

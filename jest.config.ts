import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  roots: ["tests"],
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverage: true,
};
export default config;

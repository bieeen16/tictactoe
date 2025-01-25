/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx}",
  ],
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  verbose: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,jsx}",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
  rootDir: ".",
  transformIgnorePatterns: [
    "/node_modules/(?!punycode|other-modules-to-transform)/",
  ],
  silent: true,
};

module.exports = config;

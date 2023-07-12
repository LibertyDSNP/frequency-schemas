module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ["./test/jestSetup.cjs"],
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1"
  }
};

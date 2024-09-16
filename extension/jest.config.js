module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: [
    '**/src/**/*.test.ts'
  ],
};
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    document: '<rootDir>/tests/fitbit-mocks/document.ts',
    'user-settings': '<rootDir>/tests/fitbit-mocks/user-settings.ts',
    'user-activity': '<rootDir>/tests/fitbit-mocks/user-activity.ts'
  }
};
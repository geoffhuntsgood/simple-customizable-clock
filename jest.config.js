var mockDir = '<rootDir>/tests/fitbit-mocks/';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    appbit: mockDir + 'appbit.ts',
    document: mockDir + 'document.ts',
    fs: mockDir + 'fs.ts',
    messaging: mockDir + 'messaging.ts',
    'user-activity': mockDir + 'user-activity.ts',
    'user-profile': mockDir + 'user-profile.ts',
    'user-settings': mockDir + 'user-settings.ts'
  }
};
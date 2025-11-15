module.exports = {
  projects: [
    {
      displayName: 'Frontend Unit Tests',
      preset: 'react-native',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@react-native/babel-preset'] }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|@reduxjs/toolkit)/)',
      ],
      moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    },
    {
      displayName: 'Backend',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/backend/src/**/__tests__/**/*.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/backend/src/test/setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/backend/src/$1',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'backend/src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!backend/src/**/*.d.ts',
    '!src/test/**/*',
    '!backend/src/test/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
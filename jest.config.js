module.exports = {
  projects: [
    {
      displayName: 'Frontend Unit Tests',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
      },
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
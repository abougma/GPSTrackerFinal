import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.ts'], 
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;

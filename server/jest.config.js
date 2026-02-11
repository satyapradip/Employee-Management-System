export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testTimeout: 10000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/seeders/**',
    '!src/config/**'
  ],
  verbose: true
};
// jest.config.js
export default {
  testEnvironment: 'node', // Use Node environment for testing
  transform: {
      '^.+\\.js$': 'babel-jest', // Use Babel for transforming JS files
  },
  globals: {
      'babel-jest': {
          useESModules: true, // Enable ES modules for Babel
      },
  },
};

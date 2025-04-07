// jest.config.js
module.exports = {
  preset: 'jest-expo',
  // Add setup file for mocks or global setup
  setupFilesAfterEnv: ['./jest-setup.js'],
  // Optional: Transform ignore patterns if you encounter issues with specific libraries
  // transformIgnorePatterns: [
  //   'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  // ],
};
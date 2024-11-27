module.exports = {
    preset: "jest-expo",
    transformIgnorePatterns: [
      "node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@unimodules/.*|unimodules|sentry-expo|native-base)"
    ],
  };
  
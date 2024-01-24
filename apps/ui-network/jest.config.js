module.exports = {
  displayName: "ui-network",
  preset: "../../jest.ui.preset.js",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nrwl/react/plugins/jest",
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/apps/ui-network",
  setupFiles: ["./test-setup.ts"],
};

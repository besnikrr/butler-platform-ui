module.exports = {
  displayName: 'ui-voucher',
  preset: '../../jest.ui.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/ui-voucher',
  collectCoverage: true,
  coverageReporters: ["text", "html"],
  coveragePathIgnorePatterns: ["/node_modules/", "__tests__"],
  setupFiles: ["./test-setup.ts"]
};

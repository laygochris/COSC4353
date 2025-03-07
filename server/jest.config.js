module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
  };
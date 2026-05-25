module.exports = {
  allowCypressEnv: false,

  e2e: {
    // match any spec files under tests/cypress (handles nested cypress folders)
    specPattern: '/Users/lakshyaduhoon/Documents/react/pms_mern/tests/cypress/cypress/e2e/showProduct.cy.js',
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config
    },
  },
};

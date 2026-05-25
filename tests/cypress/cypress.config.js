module.exports = {
  allowCypressEnv: false,

  e2e: {
    // match all Cypress specs in this project folder
    specPattern: 'cypress/e2e/**/*.cy.js',
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

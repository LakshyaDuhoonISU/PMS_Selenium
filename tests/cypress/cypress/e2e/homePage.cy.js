describe('Home Page', () => {
    it('opens the home page and shows the product listing UI', () => {
        cy.visit('/')

        cy.url().should('eq', 'http://localhost:5173/')
        cy.contains('All Products').should('be.visible')
        cy.get('table').should('be.visible')
        cy.contains('th', 'Product Name').should('be.visible')
        cy.contains('th', 'Price').should('be.visible')
        cy.contains('th', 'Category').should('be.visible')
        cy.contains('th', 'Quantity').should('be.visible')
        cy.contains('th', 'Image').should('be.visible')
        cy.contains('th', 'Actions').should('be.visible')
        cy.get('a[href="/stats"]').should('exist').and('be.visible')
        cy.get('a[href="/create"]').should('exist').and('be.visible')
    })
})

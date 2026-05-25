describe('Stats Page', () => {
    it('opens home page first and then opens stats page by clicking the stats button', () => {
        cy.visit('/')

        cy.contains('All Products').should('be.visible')
        cy.get('a[href="/stats"]').should('exist').and('be.visible').click()

        cy.url().should('include', '/stats')
        cy.contains('Product Stats').should('be.visible')
        cy.contains('Total products:').should('be.visible')
        cy.contains('Total inventory value:').should('be.visible')
        cy.contains('By Category').should('be.visible')
        cy.contains('button', 'Back').should('be.visible')
    })
})

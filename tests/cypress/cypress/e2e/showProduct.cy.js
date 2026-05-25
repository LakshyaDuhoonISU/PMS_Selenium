describe('template spec', () => {
  it('creates a new product and shows its details', () => {
    const payload = {
      name: 'cypress-show-' + Date.now(),
      price: '7',
      quantity: '3',
      imageURL: 'https://example.com/x.png',
      category: 'CYP'
    }

    cy.visit('/')
    cy.contains('All Products').should('be.visible')
    cy.get('table').should('be.visible')

    cy.visit('/create')
    cy.contains('h1', 'Create Product').should('be.visible')
    cy.get('input[placeholder="Enter name"]').should('be.visible').type(payload.name)
    cy.get('input[placeholder="Enter price"]').should('be.visible').type(payload.price)
    cy.get('input[placeholder="Enter quantity"]').should('be.visible').type(payload.quantity)
    cy.get('input[placeholder="Enter image URL"]').should('be.visible').type(payload.imageURL)
    cy.get('input[placeholder="Enter category"]').should('be.visible').type(payload.category)

    cy.contains('button', 'Add Product').should('be.visible').click()

    cy.url().should('include', '/products')
    cy.contains('All Products').should('be.visible')
    cy.get('table').should('be.visible')

    cy.contains('tr', payload.name).should('be.visible').within(() => {
      cy.get('a[href*="/show/"]').should('exist').click()
    })

    cy.url().should('include', '/show/')
    cy.contains(payload.name)
    cy.contains(`Price: ₹${payload.price}`)
    cy.contains(`Quantity: ${payload.quantity}`)
    cy.contains(`Category: ${payload.category}`)
  })
})
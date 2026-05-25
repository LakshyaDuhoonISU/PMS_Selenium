describe('template spec', () => {
  it('passes', () => {
    // Create a product via the backend API, then navigate to products and open the show page
    const apiBase = 'http://localhost:3000/products'
    const payload = {
      name: 'cypress-show-' + Date.now(),
      price: 7,
      quantity: 3,
      imageURL: 'https://example.com/x.png',
      category: 'CYP'
    }

    cy.request('POST', apiBase, payload).then((resp) => {
      expect(resp.status).to.eq(201)
      const product = resp.body
      const id = product._id || product.id
      const name = product.name
      const price = product.price
      const quantity = product.quantity
      const category = product.category

      // visit products list (baseUrl is configured for Cypress)
      cy.visit('/products')

      // click the show (eye) link for this product
      cy.get(`a[href="/show/${id}"]`).should('exist').click()

      // assert show page and product details
      cy.url().should('include', `/show/${id}`)
      cy.contains(name)
      cy.contains(`Price: ₹${price}`)
      cy.contains(`Quantity: ${quantity}`)
      cy.contains(`Category: ${category}`)
    })
  })
})
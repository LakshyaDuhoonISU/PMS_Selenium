describe('Delete Product', () => {
    const apiBase = 'http://localhost:3000/products'

    function createProductViaUi() {
        const payload = {
            name: 'cypress-delete-' + Date.now(),
            price: '19',
            quantity: '2',
            imageURL: 'https://example.com/delete.png',
            category: 'CYP'
        }

        cy.visit('/')
        cy.contains('All Products').should('be.visible')
        cy.get('table').should('be.visible')

        cy.visit('/create')
        cy.contains('h1', 'Create Product').should('be.visible')
        cy.get('input[placeholder="Enter name"]').type(payload.name)
        cy.get('input[placeholder="Enter price"]').type(payload.price)
        cy.get('input[placeholder="Enter quantity"]').type(payload.quantity)
        cy.get('input[placeholder="Enter image URL"]').type(payload.imageURL)
        cy.get('input[placeholder="Enter category"]').type(payload.category)
        cy.contains('button', 'Add Product').click()

        cy.url().should('include', '/products')
        cy.contains('All Products').should('be.visible')

        return cy.contains('tr', payload.name).then(($row) => {
            expect($row).to.exist
            return payload
        })
    }

    it('opens the product in the show page and deletes it from there', () => {
        createProductViaUi().then((product) => {
            const name = product.name

            cy.contains('tr', name).within(() => {
                cy.get('a[href*="/show/"]').should('exist').click()
            })

            cy.url().should('include', '/show/')
            cy.contains('h1', name).should('be.visible')
            cy.contains(`Price: ₹${product.price}`).should('be.visible')
            cy.contains(`Quantity: ${product.quantity}`).should('be.visible')
            cy.contains(`Category: ${product.category}`).should('be.visible')

            cy.contains('button', 'Delete').should('be.visible').click()

            cy.url().should('include', '/products')
            cy.contains('All Products').should('be.visible')
            cy.contains('tr', name).should('not.exist')

            cy.request({
                method: 'GET',
                url: apiBase,
                failOnStatusCode: false,
            }).then((getResp) => {
                expect(getResp.status).to.eq(200)
                const deletedProduct = getResp.body.find((item) => item.name === name)
                expect(deletedProduct).to.not.exist
            })
        })
    })
})

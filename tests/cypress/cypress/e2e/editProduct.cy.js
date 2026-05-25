describe('Edit Product', () => {
    const apiBase = 'http://localhost:3000/products'

    function createProductViaUi() {
        const uniqueSuffix = Date.now()
        const payload = {
            name: `cypress-edit-${uniqueSuffix}`,
            price: '11',
            quantity: '4',
            imageURL: 'https://example.com/edit.png',
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

    it('opens the edit form, updates the product, and shows the updated values', () => {
        createProductViaUi().then((product) => {
            const originalName = product.name
            const updatedName = `${originalName}-updated`
            const updatedPrice = '22'
            const updatedQuantity = '9'
            const updatedCategory = 'ELECTRONICS'

            cy.contains('tr', originalName).within(() => {
                cy.get('a[href*="/update/"]').should('exist').click()
            })

            cy.url().should('include', '/update/')
            cy.contains('h1', 'Update Product').should('be.visible')
            cy.get('input[name="name"]').should('have.value', originalName)

            cy.get('input[name="name"]').clear().type(updatedName)
            cy.get('input[name="price"]').clear().type(updatedPrice)
            cy.get('input[name="quantity"]').clear().type(updatedQuantity)
            cy.get('input[name="imageURL"]').clear().type('https://example.com/edit-updated.png')
            cy.get('input[name="category"]').clear().type(updatedCategory)

            cy.contains('button', 'Update Product').click()

            cy.url().should('include', '/products')
            cy.contains('All Products').should('be.visible')
            cy.contains('tr', updatedName).should('exist').and('be.visible')
            cy.contains('tr', updatedName).should('contain.text', updatedName)

            cy.contains('tr', updatedName).within(() => {
                cy.get('a[href*="/update/"]').should('exist')
            })

            cy.request('GET', apiBase).then((listResp) => {
                expect(listResp.status).to.eq(200)
                const updatedProduct = listResp.body.find((item) => item.name === updatedName)
                expect(updatedProduct).to.exist
                expect(updatedProduct).to.include({
                    name: updatedName,
                    price: Number(updatedPrice),
                    quantity: Number(updatedQuantity),
                    category: updatedCategory,
                })
                expect(updatedProduct.imageURL).to.eq('https://example.com/edit-updated.png')
            })
        })
    })
})

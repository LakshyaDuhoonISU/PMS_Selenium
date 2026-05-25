describe('Add Product', () => {
    const apiBase = 'http://localhost:3000/products'

    function addProductViaUi() {
        const product = {
            name: `cypress-add-${Date.now()}`,
            price: '12',
            quantity: '5',
            imageURL: 'https://example.com/add.png',
            category: 'CYP',
        }

        cy.visit('/')
        cy.contains('All Products').should('be.visible')
        cy.get('table').should('be.visible')

        cy.visit('/create')

        cy.contains('h1', 'Create Product').should('be.visible')
        cy.get('input[placeholder="Enter name"]').should('be.visible').type(product.name)
        cy.get('input[placeholder="Enter price"]').should('be.visible').type(product.price)
        cy.get('input[placeholder="Enter quantity"]').should('be.visible').type(product.quantity)
        cy.get('input[placeholder="Enter image URL"]').should('be.visible').type(product.imageURL)
        cy.get('input[placeholder="Enter category"]').should('be.visible').type(product.category)

        cy.contains('button', 'Add Product').should('be.visible').click()

        cy.url().should('include', '/products')
        cy.contains('All Products').should('be.visible')
        cy.get('table').should('be.visible')

        return cy.wrap(product)
    }

    it('creates a product through the UI and shows it in the products table', () => {
        addProductViaUi().then((product) => {
            cy.contains('tr', product.name).should('be.visible')
            cy.contains('tr', product.name).within(() => {
                cy.contains(product.price).should('exist')
                cy.contains(product.category).should('exist')
                cy.contains(product.quantity).should('exist')
            })

            cy.request('GET', apiBase).then((resp) => {
                expect(resp.status).to.eq(200)
                const addedProduct = resp.body.find((item) => item.name === product.name)
                expect(addedProduct).to.exist
                expect(addedProduct).to.include({
                    name: product.name,
                    price: Number(product.price),
                    quantity: Number(product.quantity),
                    category: product.category,
                })
                expect(addedProduct.imageURL).to.eq(product.imageURL)
            })
        })
    })
})

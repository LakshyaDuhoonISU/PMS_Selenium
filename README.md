# Product Management System (PMS)

This project is a MERN-based product management system with a React frontend, an Express/MongoDB backend, Selenium UI automation, Cypress end-to-end tests, and a JMeter HTTP test plan.

## Project Structure

```text
pms_mern/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── create-product/
│   │   │   ├── not-found/
│   │   │   ├── products/
│   │   │   ├── show-product/
│   │   │   ├── stats/
│   │   │   └── update-product/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── tests/
    ├── cypress/
    │   ├── cypress.config.js
    │   └── cypress/e2e/
    ├── jmeter/
    │   └── PMSHttpTest.jmx
    └── selenium/
        ├── pom.xml
        ├── testng.xml
        └── src/test/java/com/example/selenium/
```

## Features

- Product CRUD APIs
- Product statistics API
- React UI for listing, creating, updating, viewing, and deleting products
- Selenium TestNG browser tests
- Cypress browser tests
- JMeter API performance plan

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally
- Java 17 and Maven 3.8+ for Selenium tests
- Cypress installed under the `tests/cypress` project
- JMeter for the HTTP test plan

## Environment Variables

Backend reads MongoDB connection settings from environment variables.

Create a backend `.env` file with:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/pms_mern
```

If `MONGODB_URI` is not set, the backend falls back to `mongodb://127.0.0.1:27017/pms_mern`.

## How to Run

### 1. Start MongoDB

Make sure MongoDB is running locally before starting the backend.

### 2. Run the Backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on `http://localhost:3000` by default.

Health check:

```bash
GET http://localhost:3000/health
```

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` with Vite.

## Backend API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| GET    | `/health`         | Health check           |
| GET    | `/products`       | Get all products       |
| GET    | `/products/:id`   | Get a single product   |
| POST   | `/products`       | Create a product       |
| PUT    | `/products/:id`   | Update a product       |
| DELETE | `/products/:id`   | Delete a product       |
| GET    | `/products/stats` | Get product statistics |

Example create payload:

```json
{
  "name": "Laptop",
  "price": 55000,
  "quantity": 10,
  "imageURL": "https://example.com/laptop.png",
  "category": "Electronics"
}
```

## Frontend Routes

| Route         | Page                 |
| ------------- | -------------------- |
| `/`           | Products list        |
| `/products`   | Products list        |
| `/create`     | Create product       |
| `/show/:id`   | View product details |
| `/update/:id` | Update product       |
| `/stats`      | Stats page           |

## Selenium Tests

Selenium tests live under `tests/selenium` and are driven by TestNG.

Main suite file:

```bash
tests/selenium/testng.xml
```

The suite runs these tests in order:

- Home page
- Stats page
- Add product
- Edit product
- View product
- Delete product

Run Selenium tests:

```bash
cd tests/selenium
mvn test
```

## Cypress Tests

The Cypress project is under `tests/cypress` and is configured to use:

- `baseUrl: http://localhost:5173`
- spec pattern: `cypress/e2e/**/*.cy.js`

Test files:

- `homePage.cy.js`
- `statsPage.cy.js`
- `showProduct.cy.js`
- `addProduct.cy.js`
- `editProduct.cy.js`
- `deleteProduct.cy.js`

Run Cypress from the Cypress project folder:

```bash
npx cypress open --config-file tests/cypress/cypress.config.js
```

or run headless:

```bash
npx cypress run --config-file tests/cypress/cypress.config.js
```

The Cypress suite is also wired into Jenkins in the same style as the Selenium tests.

## JMeter Test Plan

The JMeter HTTP test plan is located at:

```bash
tests/jmeter/PMSHttpTest.jmx
```

It covers:

- Home / all products request
- Stats request
- Add product request
- Edit product request
- View product request
- Delete product request

Open the `.jmx` file in JMeter and run it against the backend on `http://localhost:3000`.

## Typical Development Flow

1. Start MongoDB.
2. Start the backend.
3. Start the frontend.
4. Open the app in the browser at `http://localhost:5173`.
5. Run Selenium, Cypress, or JMeter tests from their respective folders as needed.

## Notes

- The backend uses Express and Mongoose.
- The frontend uses React Router for navigation.
- Product detail pages, update pages, and stats pages are all routed in the frontend.
- Cypress and Selenium are both used for browser-based verification.
- JMeter is included for API-level load and functional testing.

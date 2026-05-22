# Backend API

Express + MongoDB backend for the product management frontend.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- CORS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the `backend` folder:

```bash
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/pms_mern
```

3. Start the backend:

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default.

## Data Model

### Product

| Field      | Type   | Required | Notes                           |
| ---------- | ------ | -------- | ------------------------------- |
| `name`     | String | Yes      | Trimmed text                    |
| `price`    | Number | Yes      | Must be `>= 0`                  |
| `quantity` | Number | Yes      | Must be `>= 0`, defaults to `0` |
| `imageURL` | String | Yes      | Trimmed text                    |
| `category` | String | Yes      | Trimmed text                    |

MongoDB automatically adds:

- `_id`
- `createdAt`
- `updatedAt`
- `__v`

## API Endpoints

Base URL: `http://localhost:3000`

### Health Check

`GET /health`

Response:

```json
{
  "status": "ok"
}
```

### Get All Products

`GET /products`

Response: array of product objects.

```json
[
  {
    "_id": "66a1f7c2f3b2c1e9a1234567",
    "name": "Test Product",
    "price": 99,
    "quantity": 3,
    "imageURL": "https://example.com/image.png",
    "category": "ELECTRONICS",
    "createdAt": "2026-05-22T09:42:08.842Z",
    "updatedAt": "2026-05-22T09:42:08.842Z",
    "__v": 0
  }
]
```

### Stats Endpoint

`GET /products/stats`

Returns aggregated statistics about products:

Response example:

```json
{
  "totalProducts": 42,
  "totalInventoryValue": 12345.67,
  "byCategory": {
    "ELECTRONICS": 12,
    "CLOTHING": 20,
    "FOOTWEAR": 10
  }
}
```

Notes:

- `totalProducts`: total number of product documents.
- `totalInventoryValue`: sum of `price * quantity` across all products.
- `byCategory`: object mapping category name to product count.

### Get Product By Id

`GET /products/:id`

Path params:

- `id`: MongoDB ObjectId

Success response:

```json
{
  "_id": "66a1f7c2f3b2c1e9a1234567",
  "name": "Test Product",
  "price": 99,
  "quantity": 3,
  "imageURL": "https://example.com/image.png",
  "category": "ELECTRONICS",
  "createdAt": "2026-05-22T09:42:08.842Z",
  "updatedAt": "2026-05-22T09:42:08.842Z",
  "__v": 0
}
```

Possible errors:

```json
{ "message": "Invalid product id" }
```

```json
{ "message": "Product not found" }
```

### Create Product

`POST /products`

Request body:

```json
{
  "name": "Test Product",
  "price": 99,
  "quantity": 3,
  "imageURL": "https://example.com/image.png",
  "category": "ELECTRONICS"
}
```

Notes:

- `price` and `quantity` are converted to numbers before saving.
- The frontend can send them as strings or numbers.

Success response: the created product object.

```json
{
  "_id": "66a1f7c2f3b2c1e9a1234567",
  "name": "Test Product",
  "price": 99,
  "quantity": 3,
  "imageURL": "https://example.com/image.png",
  "category": "ELECTRONICS",
  "createdAt": "2026-05-22T09:42:08.842Z",
  "updatedAt": "2026-05-22T09:42:08.842Z",
  "__v": 0
}
```

### Update Product

`PUT /products/:id`

Path params:

- `id`: MongoDB ObjectId

Request body:

```json
{
  "name": "Updated Product",
  "price": 120,
  "quantity": 5,
  "imageURL": "https://example.com/new-image.png",
  "category": "CLOTHING"
}
```

Notes:

- All fields are expected in the request body.
- `price` and `quantity` are converted to numbers before updating.
- Validation runs on update.

Success response: the updated product object.

```json
{
  "_id": "66a1f7c2f3b2c1e9a1234567",
  "name": "Updated Product",
  "price": 120,
  "quantity": 5,
  "imageURL": "https://example.com/new-image.png",
  "category": "CLOTHING",
  "createdAt": "2026-05-22T09:42:08.842Z",
  "updatedAt": "2026-05-22T09:45:10.101Z",
  "__v": 0
}
```

Possible errors:

```json
{ "message": "Invalid product id" }
```

```json
{ "message": "Product not found" }
```

### Delete Product

`DELETE /products/:id`

Path params:

- `id`: MongoDB ObjectId

Success response:

```json
{
  "message": "Product deleted successfully"
}
```

Possible errors:

```json
{ "message": "Invalid product id" }
```

```json
{ "message": "Product not found" }
```

## Frontend Integration

The frontend is already configured to call:

- `GET http://localhost:3000/products`
- `GET http://localhost:3000/products/:id`
- `POST http://localhost:3000/products`
- `PUT http://localhost:3000/products/:id`
- `DELETE http://localhost:3000/products/:id`

CORS is enabled on the backend, so the frontend can run on a different port during development.

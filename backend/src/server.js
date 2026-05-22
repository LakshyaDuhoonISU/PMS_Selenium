import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './utils/db.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use('/products', productRoutes)

app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

async function startServer() {
    try {
        await connectDB()
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
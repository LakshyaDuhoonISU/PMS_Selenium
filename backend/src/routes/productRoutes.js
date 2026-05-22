import { Router } from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const router = Router()

router.get('/', async (_req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message })
    }
})

// Stats endpoint - totals and breakdowns
router.get('/stats', async (_req, res) => {
    try {
        const totals = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalInventoryValue: { $sum: { $multiply: ["$price", "$quantity"] } }
                }
            },
            { $project: { _id: 0, totalProducts: 1, totalInventoryValue: 1 } }
        ])

        const byCategoryAgg = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ])

        const totalsObj = totals[0] || { totalProducts: 0, totalInventoryValue: 0 }
        const byCategory = {}
        byCategoryAgg.forEach((c) => { byCategory[c._id] = c.count })

        res.json({
            totalProducts: totalsObj.totalProducts,
            totalInventoryValue: totalsObj.totalInventoryValue,
            byCategory
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to compute stats', error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product id' })
        }

        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch product', error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { name, price, quantity, imageURL, category } = req.body

        const product = await Product.create({
            name,
            price: Number(price),
            quantity: Number(quantity),
            imageURL,
            category
        })

        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ message: 'Failed to create product', error: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product id' })
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                price: Number(req.body.price),
                quantity: Number(req.body.quantity),
                imageURL: req.body.imageURL,
                category: req.body.category
            },
            { new: true, runValidators: true }
        )

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json(updatedProduct)
    } catch (error) {
        res.status(400).json({ message: 'Failed to update product', error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product id' })
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id)

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error: error.message })
    }
})

export default router
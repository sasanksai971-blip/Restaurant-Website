"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.get('/products', async (req, res) => {
    const { categoryId, isVeg, search, sort, isBestSeller } = req.query;
    const where = {};
    if (categoryId)
        where.categoryId = String(categoryId);
    if (isVeg !== undefined)
        where.isVeg = isVeg === 'true';
    if (isBestSeller !== undefined)
        where.isBestSeller = isBestSeller === 'true';
    if (search) {
        where.name = { contains: String(search) }; // SQLite doesn't have insensitive mode directly here in simple ways, but this is fine
    }
    let orderBy = {};
    if (sort === 'price_asc')
        orderBy = { price: 'asc' };
    else if (sort === 'price_desc')
        orderBy = { price: 'desc' };
    try {
        const products = await prisma_1.default.product.findMany({
            where,
            orderBy: Object.keys(orderBy).length ? orderBy : undefined,
            include: { category: true }
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
router.get('/products/:id', async (req, res) => {
    try {
        const product = await prisma_1.default.product.findUnique({
            where: { id: req.params.id },
            include: { category: true }
        });
        if (!product)
            return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany();
        res.json({ success: true, data: categories });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.default = router;

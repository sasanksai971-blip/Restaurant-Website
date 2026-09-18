"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// ─── Public Options Endpoint ──────────────────────────────────────────────
router.get('/custom-pizza/options', async (req, res) => {
    try {
        const [sizes, crusts, sauces, cheeses, toppings, extras] = await Promise.all([
            prisma_1.default.pizzaSize.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaCrust.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaSauce.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaCheese.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaTopping.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaExtra.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        ]);
        res.json({
            success: true,
            data: {
                sizes,
                crusts,
                sauces,
                cheeses,
                toppings,
                extras,
            },
        });
    }
    catch (error) {
        console.error('Error fetching custom pizza options', error);
        res.status(500).json({ success: false, message: 'Server error loading customizer options' });
    }
});
// ─── Server-Side Calculation & Validation (Section 18) ─────────────────────
router.post('/custom-pizza/calculate', [
    (0, express_validator_1.body)('sizeId').isString().notEmpty(),
    (0, express_validator_1.body)('crustId').isString().notEmpty(),
    (0, express_validator_1.body)('sauceId').isString().notEmpty(),
    (0, express_validator_1.body)('cheeseId').isString().notEmpty(),
    (0, express_validator_1.body)('toppings').isArray(),
    (0, express_validator_1.body)('extras').isArray(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { sizeId, crustId, sauceId, cheeseId, toppings = [], extras = [] } = req.body;
    try {
        // 1. Validate and fetch base ingredients
        const size = await prisma_1.default.pizzaSize.findUnique({ where: { id: sizeId } });
        if (!size || !size.active) {
            return res.status(400).json({ success: false, message: 'Selected pizza size is unavailable.' });
        }
        const crust = await prisma_1.default.pizzaCrust.findUnique({ where: { id: crustId } });
        if (!crust || !crust.active) {
            return res.status(400).json({ success: false, message: 'Selected crust is unavailable.' });
        }
        const sauce = await prisma_1.default.pizzaSauce.findUnique({ where: { id: sauceId } });
        if (!sauce || !sauce.active) {
            return res.status(400).json({ success: false, message: 'Selected sauce is unavailable.' });
        }
        const cheese = await prisma_1.default.pizzaCheese.findUnique({ where: { id: cheeseId } });
        if (!cheese || !cheese.active) {
            return res.status(400).json({ success: false, message: 'Selected cheese is unavailable.' });
        }
        // 2. Validate and calculate toppings
        const validatedToppings = [];
        let toppingsTotal = 0;
        for (const t of toppings) {
            const topId = typeof t === 'string' ? t : (t.id || t.toppingId);
            if (!topId)
                continue;
            const topDoc = await prisma_1.default.pizzaTopping.findUnique({ where: { id: topId } });
            if (!topDoc || !topDoc.active)
                continue;
            const qty = typeof t === 'object' ? (t.quantity || t.portion || 'normal') : 'normal';
            const isExtra = qty === 'extra' || qty === 2;
            const toppingPrice = isExtra ? topDoc.extraPrice : topDoc.price;
            toppingsTotal += toppingPrice;
            validatedToppings.push({
                id: topDoc.id,
                name: topDoc.name,
                category: topDoc.category,
                quantity: isExtra ? 'extra' : 'normal',
                price: toppingPrice,
                vegetarian: topDoc.vegetarian,
                color: topDoc.color,
            });
        }
        // 3. Validate and calculate extras
        const validatedExtras = [];
        let extrasTotal = 0;
        for (const ex of extras) {
            const exId = typeof ex === 'string' ? ex : (ex.id || ex.extraId);
            if (!exId)
                continue;
            const extraDoc = await prisma_1.default.pizzaExtra.findUnique({ where: { id: exId } });
            if (!extraDoc || !extraDoc.active)
                continue;
            const qty = typeof ex === 'object' ? Math.max(1, parseInt(String(ex.quantity || 1), 10)) : 1;
            const totalItemPrice = extraDoc.price * qty;
            extrasTotal += totalItemPrice;
            validatedExtras.push({
                id: extraDoc.id,
                name: extraDoc.name,
                category: extraDoc.category,
                quantity: qty,
                unitPrice: extraDoc.price,
                price: totalItemPrice,
            });
        }
        // 4. Calculate final totals & GST
        const basePrice = size.basePrice;
        const crustPrice = crust.additionalPrice;
        const saucePrice = sauce.additionalPrice;
        const cheesePrice = cheese.additionalPrice;
        const subtotal = basePrice + crustPrice + saucePrice + cheesePrice + toppingsTotal + extrasTotal;
        const tax = Math.round(subtotal * 0.05); // 5% GST
        const total = subtotal + tax;
        // Generate descriptive name
        const pizzaName = `${size.name} ${crust.name.replace(' Hand Tossed', '')} Custom Pizza`;
        // Generate summary string
        const summaryParts = [
            size.name,
            crust.name,
            sauce.name,
            cheese.name,
            ...validatedToppings.map(t => `${t.name}${t.quantity === 'extra' ? ' (Extra)' : ''}`),
            ...validatedExtras.map(e => `${e.name} ×${e.quantity}`),
        ];
        res.json({
            success: true,
            data: {
                name: pizzaName,
                summary: summaryParts.join(' • '),
                breakdown: {
                    basePizza: { name: size.name, price: basePrice },
                    crust: { name: crust.name, price: crustPrice },
                    sauce: { name: sauce.name, price: saucePrice },
                    cheese: { name: cheese.name, price: cheesePrice },
                    toppings: validatedToppings,
                    extras: validatedExtras,
                    toppingsTotal,
                    extrasTotal,
                    subtotal,
                    tax,
                    total,
                },
                configuration: {
                    size,
                    crust,
                    sauce,
                    cheese,
                    toppings: validatedToppings,
                    extras: validatedExtras,
                },
            },
        });
    }
    catch (error) {
        console.error('Calculation error', error);
        res.status(500).json({ success: false, message: 'Server error validating pizza price' });
    }
});
// ─── Admin Endpoints (Section 20) ──────────────────────────────────────────
router.get('/admin/custom-pizza/all', async (req, res) => {
    try {
        const [sizes, crusts, sauces, cheeses, toppings, extras] = await Promise.all([
            prisma_1.default.pizzaSize.findMany({ orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaCrust.findMany({ orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaSauce.findMany({ orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaCheese.findMany({ orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaTopping.findMany({ orderBy: { sortOrder: 'asc' } }),
            prisma_1.default.pizzaExtra.findMany({ orderBy: { sortOrder: 'asc' } }),
        ]);
        res.json({
            success: true,
            data: { sizes, crusts, sauces, cheeses, toppings, extras },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching admin inventory' });
    }
});
router.patch('/admin/custom-pizza/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const updateData = req.body;
    try {
        let result;
        switch (type) {
            case 'size':
                result = await prisma_1.default.pizzaSize.update({ where: { id }, data: updateData });
                break;
            case 'crust':
                result = await prisma_1.default.pizzaCrust.update({ where: { id }, data: updateData });
                break;
            case 'sauce':
                result = await prisma_1.default.pizzaSauce.update({ where: { id }, data: updateData });
                break;
            case 'cheese':
                result = await prisma_1.default.pizzaCheese.update({ where: { id }, data: updateData });
                break;
            case 'topping':
                result = await prisma_1.default.pizzaTopping.update({ where: { id }, data: updateData });
                break;
            case 'extra':
                result = await prisma_1.default.pizzaExtra.update({ where: { id }, data: updateData });
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid ingredient type' });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error updating ingredient', error);
        res.status(500).json({ success: false, message: 'Failed to update ingredient' });
    }
});
router.post('/admin/custom-pizza/:type', async (req, res) => {
    const { type } = req.params;
    const data = req.body;
    try {
        let result;
        switch (type) {
            case 'size':
                result = await prisma_1.default.pizzaSize.create({ data });
                break;
            case 'crust':
                result = await prisma_1.default.pizzaCrust.create({ data });
                break;
            case 'sauce':
                result = await prisma_1.default.pizzaSauce.create({ data });
                break;
            case 'cheese':
                result = await prisma_1.default.pizzaCheese.create({ data });
                break;
            case 'topping':
                result = await prisma_1.default.pizzaTopping.create({ data });
                break;
            case 'extra':
                result = await prisma_1.default.pizzaExtra.create({ data });
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid ingredient type' });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error adding ingredient', error);
        res.status(500).json({ success: false, message: 'Failed to add ingredient' });
    }
});
exports.default = router;

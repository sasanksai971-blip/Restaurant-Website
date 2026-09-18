"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.get('/stores', async (req, res) => {
    const stores = await prisma_1.default.store.findMany();
    res.json({ success: true, data: stores });
});
router.get('/stores/nearby', async (req, res) => {
    const { lat, lng } = req.query;
    const stores = await prisma_1.default.store.findMany();
    if (lat && lng) {
        const userLat = parseFloat(String(lat));
        const userLng = parseFloat(String(lng));
        // Simple Euclidean distance for mock
        stores.sort((a, b) => {
            const distA = Math.pow(a.latitude - userLat, 2) + Math.pow(a.longitude - userLng, 2);
            const distB = Math.pow(b.latitude - userLat, 2) + Math.pow(b.longitude - userLng, 2);
            return distA - distB;
        });
    }
    res.json({ success: true, data: stores });
});
exports.default = router;

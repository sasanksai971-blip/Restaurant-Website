import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/products', async (req, res) => {
  const { categoryId, isVeg, search, sort, isBestSeller } = req.query;
  const where: any = {};

  if (categoryId) where.categoryId = String(categoryId);
  if (isVeg !== undefined) where.isVeg = isVeg === 'true';
  if (isBestSeller !== undefined) where.isBestSeller = isBestSeller === 'true';
  if (search) {
    where.name = { contains: String(search) }; // SQLite doesn't have insensitive mode directly here in simple ways, but this is fine
  }

  let orderBy: any = {};
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      include: { category: true }
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/addresses', authMiddleware, async (req: AuthRequest, res: any) => {
  const addresses = await prisma.address.findMany({ where: { userId: req.user!.id } });
  res.json({ success: true, data: addresses });
});

router.post('/addresses', authMiddleware, [
  body('addressLine').isString(),
  body('city').isString(),
  body('state').isString(),
  body('postalCode').isString(),
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { addressLine, city, state, postalCode, latitude, longitude, isDefault } = req.body;
  
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user!.id },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.create({
    data: { userId: req.user!.id, addressLine, city, state, postalCode, latitude, longitude, isDefault: isDefault || false }
  });
  res.json({ success: true, data: address });
});

router.patch('/addresses/:id', authMiddleware, async (req: AuthRequest, res: any) => {
  const address = await prisma.address.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json({ success: true, data: address });
});

router.delete('/addresses/:id', authMiddleware, async (req: AuthRequest, res: any) => {
  await prisma.address.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Deleted' });
});

export default router;

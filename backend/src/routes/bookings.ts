import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/bookings', authMiddleware, [
  body('storeId').isString(),
  body('date').isString(),
  body('time').isString(),
  body('guests').isInt({ min: 1 })
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { storeId, date, time, guests } = req.body;
  const booking = await prisma.tableBooking.create({
    data: { userId: req.user!.id, storeId, date, time, guests }
  });
  res.json({ success: true, data: booking });
});

router.get('/bookings', authMiddleware, async (req: AuthRequest, res: any) => {
  const bookings = await prisma.tableBooking.findMany({
    where: { userId: req.user!.id },
    include: { store: true }
  });
  res.json({ success: true, data: bookings });
});

export default router;

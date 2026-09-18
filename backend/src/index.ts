import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import offersRoutes from './routes/offers';
import cartRoutes from './routes/cart';
import storesRoutes from './routes/stores';
import ordersRoutes from './routes/orders';
import bookingsRoutes from './routes/bookings';
import bulkOrdersRoutes from './routes/bulkOrders';
import supportRoutes from './routes/support';
import addressesRoutes from './routes/addresses';
import customPizzaRoutes from './routes/customPizza';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', productsRoutes);
app.use('/api', offersRoutes);
app.use('/api', cartRoutes);
app.use('/api', storesRoutes);
app.use('/api', ordersRoutes);
app.use('/api', bookingsRoutes);
app.use('/api', bulkOrdersRoutes);
app.use('/api', supportRoutes);
app.use('/api', addressesRoutes);
app.use('/api', customPizzaRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { Router } from 'express';

import paymentRoutes from './routes/PaymentRoutes';
import rabbitMqInstance from '../data/factories/RabbitMqInstance';

const router = Router();

router.use('/payment', paymentRoutes);

rabbitMqInstance.start();

export default router;

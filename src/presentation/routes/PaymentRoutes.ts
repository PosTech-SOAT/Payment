import { Router } from 'express';
import PaymentController from '../../infra/controllers/PaymentController';
import { PaymentRepository } from '../../domain/repositories/PaymentRepository';

const paymentRoute = Router();

const paymentController = new PaymentController(new PaymentRepository());

paymentRoute.post('/', (req, res) =>
	paymentController.create(req, res, paymentController),
);
paymentRoute.get('/callback', (req, res) =>
	paymentController.paymentWebhook(req, res),
);

export default paymentRoute;

import { Request, Response } from 'express';
import { IPaymentRepository } from '../../domain/interfaces/repositories/IPaymentRepository';
import { OrderDto } from '../dto/OrderDto';
import { PaymentWebhookRequestParams } from '../dto/PaymentWebhookRequestDto';
import rabbitMqInstance from '../../data/factories/RabbitMqInstance';
export default class PaymentController {
	private paymentRepository: IPaymentRepository;
	constructor(paymentRepository: IPaymentRepository) {
		this.paymentRepository = paymentRepository;
	}

	async create(
		request: Request,
		response: Response,
		instance: PaymentController,
	) {
		try {
			const payment_url = await instance.paymentRepository.CreatePayment(
				request.body as OrderDto,
			);
			return response.status(201).json({
				message: 'Payment linked created successfully',
				payment_url: payment_url,
			});
		} catch (error: any) {
			return response.status(400).json({ message: error.message });
		}
	}
	async paymentWebhook(request: Request, response: Response) {
		const query = request.query as unknown as PaymentWebhookRequestParams;

		await rabbitMqInstance.enQueue('payment_update', JSON.stringify(query));
		response
			.status(200)
			.json({ message: 'Pedido enviado para fila de processamento!' });
	}
}

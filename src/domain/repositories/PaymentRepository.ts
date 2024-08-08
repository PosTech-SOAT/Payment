import { MercadoPagoConfig, Preference } from 'mercadopago';
import { IPaymentRepository } from '../interfaces/repositories/IPaymentRepository';
import { OrderDto } from '../../infra/dto/OrderDto';

const GENERIC_ERROR_MESSAGE =
	'Ocorreu um erro ao tentar gerar o link de pagamento!';

export class PaymentRepository implements IPaymentRepository {
	async CreatePayment(order: OrderDto | null) {
		if (order) {
			const client = new MercadoPagoConfig({
				accessToken: process.env.ML_ACCESS_TOKEN || '',
			});
			const preference = new Preference(client);
			try {
				const paymentDetails = await preference.create({
					body: {
						items: order.products.map((product) => ({
							id: product.id,
							title: product.name,
							currency_id: 'BRL',
							picture_url:
								'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif',
							description: product.description,
							category_id: 'teste',
							quantity: 1,
							unit_price: product.price,
						})),

						payer: {
							//email teste
							email: 'liguo1122@uorak.com',
						},
						back_urls: {
							success:
								'http://postech_payment_container:3002/api/payment/callback',
							failure:
								'http://postech_payment_container:3002/api/payment/callback',
							pending:
								'http://postech_payment_container:3002/api/payment/callback',
						},
						payment_methods: {
							installments: 1,
						},
						auto_return: 'all',
						external_reference: order.id,
					},
				});
				return paymentDetails.sandbox_init_point;
			} catch (error) {
				throw new Error(GENERIC_ERROR_MESSAGE);
			}
		}

		throw new Error(GENERIC_ERROR_MESSAGE);
	}
}

import { Channel, connect, Connection, Message } from 'amqplib';

export default class RabbitmqServer {
	private connection: Connection;
	private channel: Channel;

	constructor(private uri: string) {}

	async start(): Promise<void> {
		this.connection = await connect(this.uri);
		this.channel = await this.connection.createChannel();
	}

	async enQueue(queue: string, message: string) {
		return this.channel.sendToQueue(queue, Buffer.from(message));
	}

	async deQueue(queue: string, callback: (message: Message) => void) {
		return this.channel.consume(queue, (message) => {
			if (message) {
				callback(message);
				this.channel.ack(message);
			}
		});
	}
}

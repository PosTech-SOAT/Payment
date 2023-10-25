import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
	ManyToOne,
	Column,
	OneToMany,
	JoinColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { Client } from './Client';
import { Product } from './Product';

export enum OrderStatus {
  RECEBIDO = 'RECEBIDO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  PRONTO = 'PRONTO',
  FINALIZADO = 'FINALIZADO',
}

@Entity('Orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  	id: string;

  @Column({
  	type: 'enum',
  	enum: OrderStatus,
  	default: OrderStatus.EM_PREPARACAO,
  })
  	status: OrderStatus;

	@ManyToOne(() => Client, client => client.orders)
  	client: Client;

	@ManyToMany(() => Product, { eager: true })
	@JoinTable()
  	products: Product[];

  @CreateDateColumn()
  	createdAt: Date = new Date();

  @UpdateDateColumn()
  	updatedAt: Date = new Date();

  constructor() {
  	if (!this.id) {
  		this.id = uuidV4();
  	}
  }
}
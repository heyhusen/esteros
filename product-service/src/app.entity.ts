import { Entity } from 'redis-om';
import type { Product } from '@esteros/types';

export interface ProductEntity
	extends Omit<Product, 'id' | 'created_at' | 'updated_at'> {
	created_at?: string;
	updated_at?: string;
}

export class ProductEntity extends Entity {}

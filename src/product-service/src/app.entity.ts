import { Entity } from 'redis-om';
import type { Product as IProduct } from '@esteros/types';

export interface Product
	extends Omit<IProduct, 'id' | 'created_at' | 'updated_at'> {
	created_at?: string;
	updated_at?: string;
}

export class Product extends Entity {}

import { Entity } from 'redis-om';
import type { Cart, CartItem } from '@esteros/types';

export interface CartEntity
	extends Pick<Cart, 'user_id' | 'shipping_cost' | 'total_price'> {
	products: CartItem[];
	created_at?: string;
	updated_at?: string;
}

export class CartEntity extends Entity {}

import { Entity } from 'redis-om';
import type { Cart as ICart } from '@esteros/types';

export interface Cart
	extends Pick<ICart, 'user_id' | 'shipping_cost' | 'total_price'> {
	products: string[];
	created_at?: string;
	updated_at?: string;
}

export class Cart extends Entity {}

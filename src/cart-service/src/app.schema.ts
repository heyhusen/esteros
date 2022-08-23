import { Schema } from 'redis-om';
import { Cart } from './app.entity';

export const cartSchema = new Schema(Cart, {
	user_id: {
		type: 'string',
	},
	products: {
		type: 'string[]',
	},
	shipping_cost: {
		type: 'number',
	},
	total_price: {
		type: 'number',
	},
	created_at: {
		type: 'string',
	},
	updated_at: {
		type: 'string',
	},
});

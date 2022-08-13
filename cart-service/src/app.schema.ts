import { Schema } from 'redis-om';
import { CartEntity } from './app.entity';

export const cartSchema = new Schema(CartEntity, {
	user_id: {
		type: 'string',
	},
	products: {
		type: 'string',
	},
	shipping_cost: {
		type: 'number',
	},
	total_price: {
		type: 'number',
	},
});

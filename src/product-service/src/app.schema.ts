import { Schema } from 'redis-om';
import { Product } from './app.entity';

export const productSchema = new Schema(Product, {
	name: {
		type: 'string',
	},
	description: {
		type: 'string',
	},
	sku: {
		type: 'string',
	},
	price: {
		type: 'number',
	},
	photo: {
		type: 'string',
	},
	created_at: {
		type: 'string',
	},
	updated_at: {
		type: 'string',
	},
});

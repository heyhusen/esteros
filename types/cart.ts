import type { Product } from "./product";

export interface Cart {
	id: string;
	user_id: string;
	products: Array<Product & { quantity: number }>;
	shipping_cost: number;
	total_price: number;
	created_at: string;
	updated_at: string;
}

export interface AddCartItem extends Pick<Cart, "user_id"> {
	product_id: string;
	quantity: number;
}

export interface CartItem {
	id: string;
	quantity: number;
}

export type CreateCart = Pick<Cart, "user_id"> & { products: CartItem[] };

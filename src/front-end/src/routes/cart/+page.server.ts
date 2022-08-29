import type { AddCartItem, Cart } from '@esteros/types';
import cookie from 'cookie';

import { api, baseApi } from '$lib/api';
import type { Action, PageServerLoad } from './$types';

interface Output {
	cart: Cart | null;
}

export const load: PageServerLoad<Output> = async ({ request }) => {
	const cookieHeader = request.headers.get('cookie');
	const { user_id: userId } = cookie.parse(cookieHeader || '');

	const cart = await api.get<Cart | null>('carts', {
		headers: {
			cookie: `user_id=${userId};`
		}
	});

	return {
		cart
	};
};

export const POST: Action = async ({ request, setHeaders }) => {
	const cookieRequestHeader = request.headers.get('cookie');
	const { user_id: userId } = cookie.parse(cookieRequestHeader || '');

	const values = await request.formData();

	const productId = values.get('product_id') as string;
	const quantity = values.get('quantity') as string;

	const body: Omit<AddCartItem, 'user_id'> = {
		product_id: productId,
		quantity: parseInt(quantity)
	};

	const response = await baseApi('carts', 'POST', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(userId ? { cookie: `user_id=${userId};` } : {})
		},
		body: JSON.stringify(body)
	});

	const cookieResponseHeader = response.headers.get('set-cookie');

	if (cookieResponseHeader) {
		setHeaders({
			'Set-Cookie': cookieResponseHeader
		});
	}

	return {
		location: '/cart'
	};
};

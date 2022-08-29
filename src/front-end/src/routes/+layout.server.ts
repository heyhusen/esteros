import cookie from 'cookie';
import type { Cart } from '@esteros/types';

import { api } from '$lib/api';
import type { LayoutServerLoad } from './$types';

interface Output {
	cart: Cart | null;
}

export const load: LayoutServerLoad<Output> = async ({ request }) => {
	const cookieHeader = request.headers.get('cookie');
	const { user_id: userId } = cookie.parse(cookieHeader || '');

	const cart = await api.get<Cart | null>('carts', {
		headers: {
			cookie: `user_id=${userId}`
		}
	});

	return {
		cart
	};
};

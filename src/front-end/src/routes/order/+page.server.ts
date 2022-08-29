import type { CreateOrder, Order } from '@esteros/types';
import { error, redirect } from '@sveltejs/kit';
import cookie from 'cookie';

import { api } from '$lib/api';
import type { Action, PageServerLoad } from './$types';

interface Output {
	order: Order;
}

export const load: PageServerLoad<Output> = async ({ request, locals }) => {
	const cookieHeader = request.headers.get('cookie');
	const { user_id: userId } = cookie.parse(cookieHeader || '');

	if (!userId) {
		throw redirect(303, '/');
	}

	const { orders } = locals;

	if (!orders || orders.length < 1) {
		throw redirect(303, '/cart');
	}

	const orderIndex = orders.findIndex(({ user_id }) => user_id === userId);

	if (orderIndex < 0) {
		throw redirect(303, '/cart');
	}

	const { user_id, ...order } = orders[orderIndex];

	return {
		order
	};
};

export const POST: Action = async ({ request, locals }) => {
	const cookieHeader = request.headers.get('cookie');
	const { user_id: userId } = cookie.parse(cookieHeader || '');

	const values = await request.formData();

	const email = values.get('email') as string;
	const street = values.get('street') as string;
	const zipCode = values.get('zip_code') as string;
	const city = values.get('city') as string;
	const state = values.get('state') as string;
	const country = values.get('country') as string;
	const creditCardNumber = values.get('credit_card_number') as string;
	const expirationMonth = values.get('expiration_month') as string;
	const expirationYear = values.get('expiration_year') as string;
	const ccv = values.get('ccv') as string;

	const body: Omit<CreateOrder, 'user_id'> = {
		email,
		address: {
			street,
			zip_code: parseInt(zipCode),
			city,
			state,
			country
		},
		credit_card: {
			number: creditCardNumber,
			expiration_month: parseInt(expirationMonth),
			expiration_year: parseInt(expirationYear),
			ccv: parseInt(ccv)
		}
	};

	const order = await api.post<Order>('orders', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(userId ? { cookie: `user_id=${userId};` } : {})
		},
		body: JSON.stringify(body)
	});

	if (!order) {
		throw error(500);
	}

	if (!Array.isArray(locals.orders)) {
		locals.orders = [];
	}

	locals.orders.push({ user_id: userId, ...order });

	// return {
	// 	location: '/order'
	// };
};

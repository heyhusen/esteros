import cookie from 'cookie';

import { baseApi } from '$lib/api';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const cookieHeader = request.headers.get('cookie');
	const { user_id: userId } = cookie.parse(cookieHeader || '');

	await baseApi('carts/empty', 'POST', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(userId ? { cookie: `user_id=${userId};` } : {})
		}
	});

	return new Response('Redirect', {
		status: 303,
		headers: {
			location: '/cart'
		}
	});
};

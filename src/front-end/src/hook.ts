import type { Handle } from '@sveltejs/kit';

export type Session = {
	userId: string;
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	return response;
};

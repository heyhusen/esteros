import { api } from '$lib/api';
import type { Product } from '@esteros/types';
import type { PageServerLoad } from './$types';

interface Output {
	product: Product | null;
}

export const load: PageServerLoad<Output> = async ({ params }) => {
	const product = await api.get<Product>(`products/${params.slug}`);

	return {
		product
	};
};

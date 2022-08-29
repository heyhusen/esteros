import { api } from '$lib/api';
import type { Product } from '@esteros/types';
import type { PageServerLoad } from './$types';

interface Output {
	products: Product[] | null;
}

export const load: PageServerLoad<Output> = async () => {
	const products = await api.get<Product[]>('products');

	return {
		products
	};
};

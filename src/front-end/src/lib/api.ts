type MethodOption = Omit<RequestInit, 'method'>;

type ApiRequest = <Output>(
	path?: string,
	options?: MethodOption
) => Promise<Output | null>;

interface Api {
	get: ApiRequest;
	post: ApiRequest;
}

export async function baseApi(
	path = '',
	method = 'GET',
	options: MethodOption = {}
) {
	const response = await fetch(`http://localhost:3000/${path}`, {
		method,
		credentials: 'include',
		...options
	});

	return response;
}

export const api: Api = {
	get: async <Output>(path = '', options?: MethodOption) => {
		const response = await baseApi(path, 'GET', options);

		try {
			const result: Output = await response.json();

			return result;
		} catch {
			return null;
		}
	},

	post: async <Output>(path = '', options?: MethodOption) => {
		const response = await baseApi(path, 'POST', options);

		try {
			const result: Output = await response.json();

			return result;
		} catch {
			return null;
		}
	}
};

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare namespace App {
	interface Locals {
		orders: Array<
			import('@esteros/types').Order & {
				user_id: string;
			}
		>;
	}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

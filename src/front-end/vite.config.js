import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		port: 3002
	},
	preview: {
		port: 8080
	}
};

export default config;

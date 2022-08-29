const daisyui = require('daisyui');
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			sans: ['Roboto', 'sans-serif']
		},
		extend: {}
	},

	plugins: [forms, typography, daisyui]
};

module.exports = config;

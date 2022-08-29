const nesting = require('tailwindcss/nesting');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = {
	plugins: [
		nesting(),
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer(),
		...(process.env.NODE_ENV === 'production'
			? [
					cssnano({
						preset: [
							'default',
							{
								discardComments: {
									removeAll: true
								}
							}
						]
					})
			  ]
			: [])
	]
};

module.exports = config;

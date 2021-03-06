const pkg = require("./package");

const routerBase = process.env.DEPLOY_ENV === "GH_PAGES" ? {
	router: {
		base: "/Productivity-Producer/"
	}
} : {};

module.exports = {
	mode: "spa",
	...routerBase,
	/*
  ** Headers of the page
  */
	head: {
		title: "Productivity Producer",
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: pkg.description }
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
		]
	},

	/*
  ** Customize the progress-bar color
  */
	loading: { color: "#fff" },

	/*
  ** Global CSS
  */
	css: [
	],

	/*
  ** Plugins to load before mounting the App
  */
	plugins: [
	],

	/*
  ** Nuxt.js modules
  */
	modules: [,
		// Doc: https://bootstrap-vue.js.org/docs/
		"bootstrap-vue/nuxt"
	],
	bootstrapVue: {
		bootstrapCSS: true,
		bootstrapVueCSS: true
	},
	/*
  ** Build configuration
  */
	build: {
		/*
    ** You can extend webpack config here
    */
		extend(config, ctx) {

		}
	}
};

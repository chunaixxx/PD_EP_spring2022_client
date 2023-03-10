const path = require('path')

module.exports = {
	transpileDependencies: ['vuetify'],

	configureWebpack: {
		resolve: {
			alias: {
				'@components': path.resolve(__dirname, 'src/components'),
				'@services': path.resolve(__dirname, 'src/services'),
				'@utils': path.resolve(__dirname, 'src/services/utils'),
				'@api': path.resolve(__dirname, 'src/services/api'),
			},
		},
	},
}

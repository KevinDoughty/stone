var path = require("path")

module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
					presets: ["@babel/preset-env"],
					plugins: [
						["@babel/plugin-transform-react-jsx", {
							"pragma": "h",
							"pragmaFrag": "Fragment",
							}]
						]
					}
				}
			}
		]
	},
	resolve: {
		extensions: ["*", ".js", ".mjs", ".jsx", ".ts", ".tsx"],
	}
}
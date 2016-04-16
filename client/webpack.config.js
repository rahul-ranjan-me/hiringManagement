module.exports = {
    entry: "./app/app.js",
    output: {
        path: __dirname,
        filename: "dist.js"
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};
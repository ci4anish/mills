module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            //{ test: /\.json$/, loader: 'json-loader' }
        ]
    },
    output: {
        filename: 'app.js',
    },
    //target: "node", //this fixes es6 imports with webpack on server
    // node: {
    //     fs: 'empty',
    //     net: 'empty',
    // }
};
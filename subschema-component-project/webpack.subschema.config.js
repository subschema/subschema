module.exports = function (config) {
    config.module.rules.push(
        {
            test: /\.tmpl$/,
            use: join('tmpl-loader'),
            include: [
                join('src')
            ]
        },

        {
            test: /\.jsx?$/,
            //do this to prevent babel from translating everything.
            use: 'babel-loader',
            exclude: [/dist/, /babylon\/.*/, /babel/],
            include: [
                join('src'),
                join('public'),
                join('samples'),
                join('test')
            ]
        },
        {
            test: /\.json$/,
            use: 'json-loader'
        });

    Object.assign(config.externals, {
        'babel-standalone-internal': {
            'var': 'Babel',
            'commonjs': 'babel',
            'commonjs2': 'babel'
        }
    });
    return config;
};

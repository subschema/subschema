var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./hot.webpack.config');
var port = config.devServer.port;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
    inline:true,
  historyApiFallback: true,
  contentBase:config.devServer.contentBase
}).listen(port, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:'+port);
});

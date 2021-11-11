const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  if (process.env.REACT_APP_PROXY_HOST && process.env.REACT_APP_PROXY_HOST !== '/' && process.env.REACT_APP_PROXY_HOST !== '') {
    app.use(
      ['/rest', '/apl'], // You can pass in an array too eg. ['/api', '/another/path']
      createProxyMiddleware({
        target: process.env.REACT_APP_PROXY_HOST,
        changeOrigin: true,
      }),
    );

    app.use(createProxyMiddleware('/socket', {
        target: process.env.REACT_APP_PROXY_HOST, 
        ws: true,
        changeOrigin: true,
        pathRewrite: function (path) { return path.replace('/socket', '') }
      }
    ));
  }
};

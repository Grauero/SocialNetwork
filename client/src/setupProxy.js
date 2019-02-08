const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  if (process.env.REACT_ENV === 'dev') {
    app.use(proxy('/api', { target: 'http://localhost:80' }));
  }
};

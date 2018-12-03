const express = require('express');
const expressPromiseRouter = require('express-promise-router');
const createWebpackFromFolioConfig = require('./create-webpack-from-folio-config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const port = 4000;

module.exports = function server({ mode = 'development', rootDirectory } = {}) {
  rootDirectory = rootDirectory || process.cwd();
  const isProduction = mode === 'production';

  const app = express();

  const webpackCompiler = createWebpackFromFolioConfig({ mode });

  if (isProduction) {
    webpackCompiler.run(() => console.log('webpack build done'));
    app.use('/templates', express.static(path.join(rootDirectory, 'build')));
  } else {
    app.use(webpackHotMiddleware(webpackCompiler, { reload: true }));
    app.use('/templates', webpackDevMiddleware(webpackCompiler));
  }

  app.listen(port, () => {
    console.log(`[folio-server] listening on port ${port}`);
  });
};

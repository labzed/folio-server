const express = require('express');
const expressPromiseRouter = require('express-promise-router');
const createWebpackFromFolioConfig = require('./create-webpack-from-folio-config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const Printer = require('./printer');

module.exports = function server({
  port = 4000,
  mode = 'development',
  rootDirectory
} = {}) {
  rootDirectory = rootDirectory || process.cwd();
  const isProduction = mode === 'production';

  const app = express();

  const router = expressPromiseRouter();

  const webpackCompiler = createWebpackFromFolioConfig({ mode });

  if (isProduction) {
    webpackCompiler.run(() => console.log('webpack build done'));
    app.use('/templates', express.static(path.join(rootDirectory, 'build')));
  } else {
    app.use(webpackHotMiddleware(webpackCompiler, { reload: true }));
    app.use('/templates', webpackDevMiddleware(webpackCompiler));
  }

  const printer = new Printer();

  router.get('/render/:templateName', async (req, res, next) => {
    const payload = encodeURIComponent(req.query.payload);
    const { templateName } = req.params;
    const pdf = await printer.print(
      `http://localhost:${port}/templates/${templateName}#${payload}`
    );

    res.type('application/pdf').send(pdf);
  });

  app.use(router);

  app.listen(port, () => {
    console.log(`[folio-server] listening on port ${port}`);
  });
};

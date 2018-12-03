const webpack = require('webpack');
const { map } = require('lodash');
const createWebpackConfig = require('./create-webpack-config');
const loadFolioConfig = require('./load-folio-config');

module.exports = function createWebpackFromFolioConfig({ mode }) {
  const folioConfig = loadFolioConfig();
  const templatesForWebpackConfig = map(folioConfig.endpoints, 'template');
  const webpackConfig = createWebpackConfig({
    mode,
    templates: templatesForWebpackConfig
  });
  return webpack(webpackConfig);
};

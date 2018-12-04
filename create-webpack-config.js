const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { fromPairs, each } = require('lodash');
const webpack = require('webpack');

function pathToName(input) {
  return path.parse(input).name;
}

module.exports = function createWebpackConfig(options = {}) {
  const { mode = 'development', templates = [] } = options;
  console.log('Setting BABEL_ENV to', options.mode);
  process.env.BABEL_ENV = options.mode;
  const rootDirectory = process.cwd(); // TODO replace with option
  const outputDirectoryName = 'build';
  console.log({ templates });
  const entries = fromPairs(templates.map(t => [pathToName(t), [t]]));
  const htmlPlugins = Object.keys(entries).map(
    template =>
      new HtmlWebpackPlugin({
        title: 'folio-server',
        filename: `${template}/index.html`,
        chunks: [template]
      })
  );

  const plugins = [
    new CleanWebpackPlugin([outputDirectoryName], { root: rootDirectory }),
    ...htmlPlugins,
    new HtmlWebpackRootPlugin()
  ];

  if (mode === 'development') {
    // Add HMR plugins
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());

    // Add HMR client file to each entry
    each(entries, entry => {
      entry.push(
        path.join(__dirname, '/node_modules/webpack-hot-middleware/client')
      );
    });
  }

  const babelLoaderUseEntry = {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        require.resolve('@babel/preset-env'),
        require.resolve('babel-preset-react-app')
      ]
    }
  }

  return {
    mode,
    devtool: 'source-map',
    context: rootDirectory,
    entry: entries,
    output: {
      filename: '[name].chunk.[hash].js',
      path: path.resolve(rootDirectory, outputDirectoryName),
      publicPath: '/templates/'
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: babelLoaderUseEntry
        },
        {
          test: /\.js$/,
          include: __dirname, // Include files loaded from this module root
          use: babelLoaderUseEntry // This uses the same babel config as on the other one
        },
        {
          test: /\.css$/,
          use: [require.resolve('style-loader'), require.resolve('css-loader')]
        }
      ]
    },
    resolve: {
      alias: {
        launcher: path.join(__dirname, 'launcher.js')
      },
      modules: [path.join(rootDirectory, 'node_modules'), 'node_modules']
    }
    //   optimization: {
    // splitChunks: {
    //   chunks: 'all'
    // }
    //   }
  };
};

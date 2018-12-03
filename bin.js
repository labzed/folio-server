#!/usr/bin/env node
const server = require('./server');
const command = process.argv[2];
const createWebpackFromFolioConfig = require('./create-webpack-from-folio-config');

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
console.log(
  `Using mode=${mode} from NODE_ENV=${JSON.stringify(process.env.NODE_ENV)}`
);

switch (command) {
  case 'build':
    const webpackCompiler = createWebpackFromFolioConfig({ mode });
    webpackCompiler.run(() => {
      console.log('webpack done');
    });
    break;

  case 'server':
    server({ mode });
    break;

  default:
    console.error('commands available:\n\tfolio-server build\n\tfolio-server');
    process.exit(1);
}

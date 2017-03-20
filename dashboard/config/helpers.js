'use strict';

const path = require('path');
const minimist = require('minimist'); // todo

const ROOT = path.resolve(__dirname, '..');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

function getCliServer() {
  const serverOptions = {
    string: 'server',
    default: {server: 'http://localhost:8080'}
  };
  console.log('>>>server: ', minimist(process.argv.slice(2), serverOptions).server);
  return minimist(process.argv.slice(2), serverOptions).server;
}

const root = path.join.bind(path, ROOT);

exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.getCliServer = getCliServer;
exports.root = root;

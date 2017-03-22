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

function getProxyServer() {
  const serverOptions = {
    string: 'env.server',
    default: {'env.server': 'http://localhost:8080'}
  };
  console.log('>>> ', minimist(process.argv.slice(2), serverOptions).env.server);
  return minimist(process.argv.slice(2), serverOptions).env.server;
}

const root = path.join.bind(path, ROOT);

exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.getProxyServer = getProxyServer;
exports.root = root;

'use strict';

const fs = require('fs');

function CheCopyAndReplacePlugin(options) {
  console.log('>>>>>>>>>>>>>>>>>>>>');
  console.log('>>> options: ', options);
  console.log('>>>>>>>>>>>>>>>>>>>>');

  this.sourceFile = options.source;
  this.destinationFile = options.destination;
  this.replaceOptions = options.replace;
}

CheCopyAndReplacePlugin.prototype.copyFile = function() {

};

CheCopyAndReplacePlugin.prototype.apply = function(compiler) {
  compiler.plugin('run', function (compiler /* manipulates webpack internal instance specific data. */, callback) {

    this.copyFile();
    this.replaceContent();

    callback();
  });
};

module.exports = CheCopyAndReplacePlugin;


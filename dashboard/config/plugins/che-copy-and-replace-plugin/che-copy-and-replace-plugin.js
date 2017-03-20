'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');

function CheCopyAndReplacePlugin(options) {
  if (!options.sourceFile || !fs.existsSync(options.sourceFile)) {
    this.error = true;
    this.log('Source file is not exist or path is incorrect.');
    return;
  }
  this.sourceFile = options.sourceFile;

  if (!options.destinationFile) {
    this.error = true;
    this.log('Destination file is not defined.');
    return;
  }
  this.destinationFile = options.destinationFile;

  if (!options.replace || !Array.isArray(options.replace) || options.replace.length === 0) {
    this.error = true;
    this.log('Replace options are incorrect.');
    return;
  }
  this.replaceOptions = options.replace;
}

CheCopyAndReplacePlugin.prototype.log = function(logMessage) {
  let message = '[che-copy-and-replace-plugin] ';

  if (this.error) {
    message += 'Error: ';
  }

  message += logMessage;
  if (this.error) {
    this.errorMessage = message;
  }
  console.log(message);
};

CheCopyAndReplacePlugin.prototype.copyFile = function() {
  try {
    fsExtra.copySync(this.sourceFile, this.destinationFile)
  } catch (e) {
    this.error = true;
    this.log('File copying failed with error: ', e);
  }
};

CheCopyAndReplacePlugin.prototype.replaceContent = function() {
  try {
    let content = fs.readFileSync(this.destinationFile).toString();

    this.replaceOptions.forEach((option) => {
      const regexp = new RegExp(option.searchVal, option.flags);

      content = content.replace(regexp, option.replaceVal);
    });

    fs.writeFileSync(this.destinationFile, content);
  } catch (e) {
    this.error = true;
    this.log('Content replacing failed with error: ', e);
  }
};

CheCopyAndReplacePlugin.prototype.apply = function(compiler) {
  let self = this;
  compiler.plugin('run', function (compiler /* manipulates webpack internal instance specific data. */, callback) {

    if (self.error) {
      return;
    }

    self.copyFile();
    if (self.error) {
      return;
    }

    self.replaceContent();
    if (self.error) {
      return;
    }

    callback();
  });
};

module.exports = CheCopyAndReplacePlugin;


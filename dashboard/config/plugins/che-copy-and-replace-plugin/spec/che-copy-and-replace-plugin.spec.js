'use strict';

const fs = require('fs');
const path = require('path');

const cheCopyAndReplacePlugin = require('../che-copy-and-replace-plugin');
const mypath = path.resolve();

describe('CheCopyAndReplacePlugin', () => {
  let options;

  beforeEach(() => {
    options = {
      sourceFile: path.resolve('spec/test.json'),
      destinationFile: path.resolve('spec/test-copy.json'),
      replace: [{
        searchVal: '%CONTENT%',
        replaceVal: '-- new content --',
        flags: ''
      }]
    };
  });

  afterEach(() => {
    // remove copied file
    if (fs.existsSync(options.destinationFile)) {
      fs.unlinkSync(options.destinationFile);
    }
  });

  it('should fail if source file is not\'t set', () => {
    options.sourceFile = undefined;
    let plugin = new cheCopyAndReplacePlugin(options);
    expect(plugin.errorMessage).toMatch(/Source file/);
  });

  it('should fail if source file is incorrect', () => {
    options.sourceFile = path.resolve('./not_existing_dir/test.json');
    let plugin = new cheCopyAndReplacePlugin(options);
    expect(plugin.errorMessage).toMatch(/Source file/);
  });

  it('shouldn\'t fail if source file is correct', () => {
    let plugin = new cheCopyAndReplacePlugin(options);
    expect(plugin.errorMessage).not.toMatch(/Source file/);
  });

  it('should fail if destination file is not\'t set', () => {
    options.destinationFile = undefined;
    let plugin = new cheCopyAndReplacePlugin(options);
    expect(plugin.errorMessage).toMatch(/Destination file/);
  });

  it('shouldn\'t fail if destination file is set', () => {
    let plugin = new cheCopyAndReplacePlugin(options);
    expect(plugin.errorMessage).not.toMatch(/Destination file/);
  });

  it('should fail if replace options are not set', () => {
    options.replace = undefined;
    let plugin = new cheCopyAndReplacePlugin(options);
    expect(plugin.errorMessage).toMatch(/Replace options/);
  });

  it('should fail if replace options are not set', () => {
    let plugin = new cheCopyAndReplacePlugin(options);
    expect(plugin.errorMessage).not.toMatch(/Replace options/);
  });

  it('should create a copy of source file', () => {
    let plugin = new cheCopyAndReplacePlugin(options);
    plugin.copyFile();
    expect(fs.readFileSync(options.destinationFile)).toBeTruthy();
  });

  it('should replace content of copied file', () => {
    let plugin = new cheCopyAndReplacePlugin(options);
    plugin.copyFile();
    plugin.replaceContent();
    expect(fs.readFileSync(options.destinationFile)).toMatch(options.replace[0].replaceVal);
  });

});

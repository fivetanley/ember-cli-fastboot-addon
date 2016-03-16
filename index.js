/* jshint node: true */
'use strict';

var Addon = require('ember-cli/lib/models/addon');

module.exports = Addon.extend({
  name: 'ember-cli-fastboot-addon',

  treeForAddon: function(tree) {
    return this._super.treeForAddon.call(this, fastbootTree(tree));
  },

  treeForApp: function(tree) {
    return fastbootTree(tree);
  }
});

module.exports.fastbootTree = fastbootTree;

function fastbootTree(app) {
  if (!app) {
    return app;
  }

  var merge  = require('broccoli-merge-trees');
  var stew = require('broccoli-stew');
  var Funnel = require('broccoli-funnel');

  var tree = new Funnel(app, {
    include: ['**/*'],
    exclude: ['fastboot/**/*']
  });

  if (isFastboot()) {
    var onlyFastboot = new Funnel(app, {
      include: ['fastboot/**/*']
    });
    onlyFastboot = stew.mv(onlyFastboot, 'fastboot/*', './');
    tree = merge([tree, onlyFastboot], {overwrite: true});
  }

  return tree;
}

function isFastboot() {
  return !!process.env.EMBER_CLI_FASTBOOT;
}

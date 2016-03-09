/*global Fastboot:true */

// This file exists to export Fastboot so you can use fastboot.require
// for your addon or in your app. Fastboot.require allows you to use
// npm modules in your app when running in Node.

if (typeof Fastboot === 'undefined') {
  throw new Error('Fastboot is undefined. This means you probably imported `ember-cli-fastboot-addon` when '+
                  'not in Node. You should only require this from files under the `fastboot` directory in your '+
                  'addon or app.');
}

export default Fastboot;

export function require(moduleName) {
  return Fastboot.require(moduleName);
}

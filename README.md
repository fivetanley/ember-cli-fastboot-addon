# Ember CLI Fastboot Addon

Provides facilities for writing code that works in both Fastboot and the
browser.

## Installation

`ember install ember-cli-fastboot-addon`

## Usage

### Addon Authors

Addons require a little more setup. If you're just using this in your
app, you can move to the next step.

You need to use the Broccoli filter in your addon. In index.js:

```javascript
module.exports = {
  name: 'my-addon',

  treeForAddon: function(tree) {
    var fastbootTree = require('ember-cli-fastboot-addon').fastbootTree;
    return this._super.treeForAddon.call(this, fastbootTree(tree));
  },

  treeForApp: function(tree) {
    var fastbootTree = require('ember-cli-fastboot-addon').fastbootTree;
    return fastbootTree(tree);
  }

}
```

### General Usage

After running `ember install`, you should have a `fastboot` directory in
either your app or your addon. Files in this `fastboot` directory will
be included when running `ember fastboot:build` or `ember
fastboot:server`, **but no other time. Do not rely on code in
`fastboot` to run in the browser build. Files in `fastboot` will NOT be
included in the normal browser build.**

For example, you may have an addon that runs in both node and the
browser. Here's the browser code:

```javascript
// addon/get-json.js

import Ember from 'ember';

export default function getJSON(url) {
  return Ember.$.getJSON(url);
}
```

Here's how someone would require that module:

```javascript
// app/routes/application.js
import Ember from 'ember';
import getJSON from 'my-cool-ajax-addon/get-json';

export default Ember.Route.extend({
  model() {
    return getJSON('https://fivetanley.cloudant.com/docs');
  }
});
```

This code however, won't run in node due to jQuery's `getJSON` method
requiring `XMLHttpRequest`, which is not available in node. We can
write a `addon/fastboot/get-json.js` file that requires a node library
to do the same thing:

```javascript
// addon/fastboot/get-json.js

import {require} from 'ember-cli-fastboot-addon';

export default function(url) {
  // https://github.com/mzabriskie/axios
  const axios = require('axios');
  return axios({
    url: url,
    responseType: 'json'
  });
}
```

With this method, you don't have to change your app code! Your `import`
statements remain the same.

### Requiring node modules from NPM

You need to import `require` from `ember-cli-fastboot-addon` like this:

```javascript
import {require} from 'ember-cli-fastboot-addon';
```

Then you can use `require` like you would in Node/Browserify/Webpack.

### But I want to use NPM Modules in the browser app too!

You should definitely take a look at
[ember-browserify](https://www.npmjs.com/package/ember-browserify).

## How does this work?

At build time, this addon checks for the presence of the
`EMBER_CLI_FASTBOOT` environment variable. This will be set by
[ember-cli-fastboot](https://github.com/tildeio/ember-cli-fastboot).

Next, it looks at the `addon` (if this is an addon)  and `app` directories. If there is a `fastboot` folder, it overwrites the files that would normally run in the browser with files from the `fastboot` folder.

If you had `addon/index.js` and `addon/fastboot/index.js`, the contents
of `addon/fastboot/index.js` would appear as the index file instead in
fastboot builds only. Otherwise, the normal `addon/index.js` file would
be used instead.

## Development Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

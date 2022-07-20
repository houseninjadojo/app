'use strict';

/**
 * PostCSS Plugins
 * Format is:
 *   {
 *     module: require('my-postcss-module'),
 *     options: {}, // (optional)
 *   };
 */

// Tailwind Configuration
// @see https://tailwindcss.com/docs/configuration
const TailwindPlugin = {
  module: require('tailwindcss'),
  options: {
    content: [
      './app/**/*.{hbs,html}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  },
};

// Autoprefix Configuration
// @see https://github.com/postcss/autoprefixer
const AutoprefixerPlugin = {
  module: require('autoprefixer'),
};

// PostCSS Import
// @see https://github.com/postcss/postcss-import
const PostCSSImportPlugin = {
  module: require('postcss-import'),
};

/**
 * Ember Application
 */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

/**
 * Build Options
 * @see https://cli.emberjs.com/release/advanced-use/
 */
module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      // skipBabel: [
      //   {
      //     package: 'rrweb',
      //     semverRange: '*',
      //   },
      // ],
      webpack: {
        resolve: {
          fallback: {
            worker_threads: require.resolve('worker_threads'),
          }
        }
      },
    },
    // PostCSS Options
    // @see https://jeffjewiss.github.io/ember-cli-postcss/docs
    postcssOptions: {
      compile: {
        enabled: true,
        plugins: [
          PostCSSImportPlugin,
          AutoprefixerPlugin,
          TailwindPlugin
        ],
      },
    },
    sourcemaps: {
      enabled: true,
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};

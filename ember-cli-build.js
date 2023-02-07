'use strict';

const webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

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
 * Webpack Plugins
 */
const webpackPlugins = [];

if (process.env.BUILD_STATS) {
  webpackPlugins.push(
    // Write stats file relative to the build directory
    new StatsWriterPlugin({
      filename: '../webpack-stats.json',
      stats: {
        assets: true,
        chunks: true,
        modules: true
      }
    })
  );
}

/**
 * Build Options
 * @see https://cli.emberjs.com/release/advanced-use/
 */
module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      alias: {
        sinon: 'sinon/pkg/sinon-esm',
      },
      webpack: {
        plugins: webpackPlugins,
        optimization: {
          splitChunks: {
            cacheGroups: {
              telemetry: {
                test: /[\\/]node_modules[\\/](@datadog|mixpanel-browser|@houseninja\/capacitor-mixpanel|branch-sdk)/,
                name: 'telemetry',
                chunks: 'all',
              },
              capacitor: {
                test: /[\\/]node_modules[\\/](@capacitor|@capawesome|@ionic|capacitor-secure-storage-plugin|@houseninja\/capacitor-[\w+]|@mineminemine)/,
                name: 'capacitor',
                chunks: 'all',
              },
              sentry: {
                test: /[\\/]node_modules[\\/](@sentry|rrweb)/,
                name: 'sentry',
                chunks: 'all',
              },
              dev: {
                test: /[\\/]node_modules[\\/](@faker-js|miragejs|@miragejs|ember-cli-mirage|crypto-js|sinon|qunit)/,
                name: 'development',
                chunks: 'all',
              },
              animations: {
                test: /[\\/]node_modules[\\/](canvas-confetti|lottie-web)/,
                name: 'animations',
                chunks: 'all',
              },
            },
          },
        },
      },
    },
    // Babel Configuration
    // @see https://babeljs.io/docs/en/options
    babel: {
      plugins: [
        ...require('ember-cli-code-coverage').buildBabelPlugin(),
      ],
    },
    // Polyfill crypto.randomUUID
    '@embroider/macros': {
      setConfig: {
        '@ember-data/store': {
          polyfillUUID: true
        },
      },
    },
    // PostCSS Configuration
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
    // Ember Configuration
    // @see https://cli.emberjs.com/release/advanced-use/
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

'use strict';

const isProduction = () => {
  return EmberApp.env() === 'production';
};

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
        enabled: false,
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

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    splitAtRoutes: ['signup'],
    packagerOptions: {
      // publicAssetURL is used similarly to Ember CLI's asset fingerprint prepend option.
      publicAssetURL: '/',
      // Embroider lets us send our own options to the style-loader
      cssLoaderOptions: {
        // don't create source maps in production
        sourceMap: isProduction() === false,
        // enable CSS modules
        modules: {
          // global mode, can be either global or local
          // we set to global mode to avoid hashing tailwind classes
          mode: 'global',
          // class naming template
          localIdentName: isProduction()
            ? '[sha512:hash:base64:5]'
            : '[path][name]__[local]',
        },
      },
      webpackConfig: {
        module: {
          rules: [
            {
              // When webpack sees an import for a CSS files
              test: /\.css$/i,
              exclude: /node_modules/,
              use: [
                {
                  // use the PostCSS loader addon
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: isProduction() === false,
                    postcssOptions: {
                      config: './postcss.config.js',
                    },
                  },
                },
              ],
            },
            {
              test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
              type: 'asset/resource',
            },
            {
              test: /\.(otf|ttf)$/i,
              type: 'asset/resource',
            },
          ],
        },
      },
    },
    extraPublicTrees: [],
  });
};

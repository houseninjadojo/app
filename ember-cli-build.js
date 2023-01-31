'use strict';

const isProduction = () => {
  return EmberApp.env() === 'production';
};

const webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

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
    // Ember Configuration
    // @see https://cli.emberjs.com/release/advanced-use/
    sourcemaps: {
      enabled: true,
    },
  });

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
        sourceMap: isProduction() === true,
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
                test: /[\\/]node_modules[\\/](@faker-js|miragejs|@miragejs|ember-cli-mirage|crypto-js)/,
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
    extraPublicTrees: [],
  });
};

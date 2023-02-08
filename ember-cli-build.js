'use strict';

/**
 * Utils
 */
const { isProdLike } = require('./lib/utils');

/**
 * Ember Application
 */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

/**
 * Webpack Plugins
 */
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const webpackPlugins = [];

if (process.env.BUILD_STATS) {
  webpackPlugins.push(
    // Write stats file relative to the build directory
    new StatsWriterPlugin({
      filename: './webpack-stats.json',
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
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: false,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: false,
    splitAtRoutes: [],
    skipBabel: [
      { package: 'qunit' },
      { package: 'sinon' }
    ],
    packagerOptions: {
      // publicAssetURL is used similarly to Ember CLI's asset fingerprint prepend option.
      publicAssetURL: '/',
      // Embroider lets us send our own options to the style-loader
      cssLoaderOptions: {
        // dont create source maps in production
        sourceMap: isProdLike() === false,
        // enable CSS modules
        modules: {
          // global mode, can be either global or local
          // we set to global mode to avoid hashing tailwind classes
          mode: 'global',
          // class naming template
          localIdentName: isProdLike()
            ? '[sha512:hash:base64:5]'
            : '[path][name]__[local]',
        },
      },
      webpackConfig: {
        devtool: isProdLike() ? 'hidden-source-map' : 'source-map',
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
                    sourceMap: isProdLike() === false,
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
      },
    },
    extraPublicTrees: [],
  });
};

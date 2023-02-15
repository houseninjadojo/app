'use strict';

/**
 * Utils
 */
const { isProdLike, isNotProdLike } = require('./lib/utils');

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
 * ember-auto-import
 */
const autoImport = {
  alias: {
    sinon: 'sinon/pkg/sinon-esm',
  },
};

/**
 * Babel Configuration
 * @see https://babeljs.io/docs/en/options
 */
// const babel = {
//   sourceMaps: 'inline',
//   plugins: [
//     ...require('ember-cli-code-coverage').buildBabelPlugin({ embroider: true }),
//   ],
// };

/**
 * Ember App
 */
// const sourcemaps = {
//   enabled: true,
//   extensions: ['js']
// };

/**
 * @embroider/macros
 */
const emberMacros = {
  setConfig: {
    // Polyfill crypto.randomUUID
    '@ember-data/store': {
      polyfillUUID: true
    },
  },
};

/**
 * Embroider Configuration
 */

// Base Config
const embroiderBase = {
  staticAddonTestSupportTrees: true,
  staticAddonTrees: false,
  staticHelpers: false,
  staticModifiers: true,
  staticComponents: false,
  splitAtRoutes: [],
};

// Skip transpiling these packages during build
const skipBabel = [
  { package: 'qunit' },
  { package: 'sinon' },
  { package: 'miragejs' },
  { package: 'lottie-web' },
];

// publicAssetURL is used similarly to Ember CLI's asset fingerprint prepend option.
const publicAssetURL = '/';

/**
 * Embroider - Webpack Configuration
 */
const webpackConfig = {
  devtool: isProdLike() ? 'hidden-source-map' : 'inline-source-map',
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
              sourceMap: isNotProdLike(),
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
};

/**
 * Embroider - CSS Loader Options
 *
 * Embroider lets us send our own options to the style-loader
 */
const cssLoaderOptions = {
  // dont create source maps in production
  sourceMap: isNotProdLike(),
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
};

/**
 * Build Options
 *
 * @see https://cli.emberjs.com/release/advanced-use/
 */
module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport,
    // babel,
    // sourcemaps,
    '@embroider/macros': emberMacros,
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    ...embroiderBase,
    skipBabel,
    packagerOptions: {
      publicAssetURL,
      cssLoaderOptions,
      webpackConfig,
    },
    extraPublicTrees: [],
  });
};

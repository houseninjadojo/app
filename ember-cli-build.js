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
  const shouldCompile = (['sandbox', 'production'].includes(process.env.EMBER_ENV));

  let app = new EmberApp(defaults, {
    // ESBuild Options
    // @see https://github.com/NullVoxPopuli/ember-cli-esbuild
    'ember-cli-esbuild': {
      enabled: shouldCompile,
      sourceMap: shouldCompile,
    },
    // PostCSS Options
    // @see https://jeffjewiss.github.io/ember-cli-postcss/docs
    postcssOptions: {
      compile: {
        enabled: true,
        plugins: [
          PostCSSImportPlugin,
          AutoprefixerPlugin,
          TailwindPlugin,
        ],
      },
    },
    sourcemaps: {
      enabled: shouldCompile,
    },
  });

  return app.toTree();
};

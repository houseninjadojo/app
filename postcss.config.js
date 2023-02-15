const { isProdLike } = require('./lib/utils');

const plugins = [
  // For the @import statements
  require('postcss-import'),

  // understands custom syntax like @apply and @screen
  require('tailwindcss/nesting'),

  // tailwind itself
  require('tailwindcss')({ config: './tailwind.config.js' }),

  // Parse CSS and add vendor prefixes to rules by Can I Use
  require('autoprefixer'),
];

if (isProdLike()) {
  plugins.push(
    // takes your nicely formatted CSS and runs it through many focused optimisations
    // to ensure that the final result is as small as possible for a production environment
    require('cssnano')({ preset: 'default' })
  );
}

module.exports = {
  plugins,
};

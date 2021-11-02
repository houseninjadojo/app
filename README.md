# app

House Ninja Mobile App

## Installation

### Prerequisites

Before you install the app, you will need the following installed:

* [asdf-vm](https://github.com/asdf-vm/asdf)
* [Xcode 13](https://apps.apple.com/us/app/xcode/id497799835)
* [GPG Suite](https://gpgtools.org/) (only core, gpg mail is not needed)

#### Set up ASDF

After following the ASDF installation instructions, add the nodejs and yarn plugins:

1. `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`
2. `asdf plugin add yarn https://github.com/twuni/asdf-yarn`

#### Set up Xcode 13

After installing Xcode13, [follow these instructions](https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator-or-on-a-device) to add an iPhone simulator.

*Note: it's best to pick one of the later iPhone models, with the latest iOS version.*

### Download from Github

In a directory of your choosing run: `git clone git@github.com:houseninjadojo/app.git`

### Install ASDF plugins

`cd` into the app directory you just checked out and run: `asdf install`.

This will install the nodejs and yarn versions locked in `.tool-versions` file and create a version-locked space for global node modules.

### Install Ember CLI

```sh
npm install -g ember-cli
```

### Install node modules

In the app directory, run: `yarn install`.

### Install Code Editor Addons (VSCode)

To help with debugging, VSCode has several helpful addons we recommend you use:

* [Unstable Ember Language Server](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-ember-unstable) - A popular fork of Ember Language Server with different features. Don't let the 'unstable' name confuse you - it's safe to use!
* [Ember JS (ES6) and Handlebars code snippets](https://marketplace.visualstudio.com/items?itemName=phanitejakomaravolu.EmberES6Snippets) - Enables Ember.js and Handlebars snippets to let you to type less and code more.
* [EditorConfig for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) - Attempts to override user/workspace settings with settings found in .editorconfig files. The .editorconfig file helps developers define and maintain consistent coding styles between different editors and IDEs.
* [Glimmer Templates Syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) - Syntax formatting for glimmer templates.
* [Prettier for Handlebars](https://marketplace.visualstudio.com/items?itemName=Alonski.prettier-for-handlebars-vscode) - Format your handlebars files with Prettier ...that's it! Note, because this uses the currently unreleased Prettier, it may break with future changes to Prettier.

For other editors like Atom or Sublime Text, see [https://guides.emberjs.com/release/code-editors/](https://guides.emberjs.com/release/code-editors/)

## Running / Development

To compile and serve on Xcode, run:

* `ember ios:serve`

When the terminal prompt shows `iOS Serve: Serving Ember app in Xcode`, Xcode will open if you have not opened it.

Then, inside the Xcode window, click the "play" arrow button in the top left. This will build the app and run it in your simulator.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint`
* `npm run lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

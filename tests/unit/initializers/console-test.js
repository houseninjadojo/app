import Application from '@ember/application';

import config from 'houseninja/config/environment';
import { initialize, content } from 'houseninja/initializers/console';
import { module, test } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';

module('Unit | Initializer | console', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };

    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = this.TestApplication.create({
      autoboot: false,
    });
  });

  hooks.afterEach(function () {
    run(this.application, 'destroy');
  });

  test('it should not log in test env', async function (assert) {
    await this.application.boot();
    assert.false(!!content('test'));
  });

  test('it should log in other env', async function (assert) {
    await this.application.boot();
    assert.true(!!content('development'));
    assert.true(!!content('production'));
  });
});

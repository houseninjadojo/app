import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
// import { stubService } from '@glimmer/tracking';

module('Integration | Component | view', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<View>view</View>`);
    assert.dom(this.element).hasText('view');
  });

  // skip('it calls applyPreservedScrollPosition on the view service when the applyPreservedScrollPosition action is triggered', async function (assert) {
  //   let viewStub = stubService('view', {
  //     applyPreservedScrollPosition: () => {
  //       assert.ok(true, 'applyPreservedScrollPosition called on view service');
  //     }
  //   });
  //   let routerStub = stubService('router');
  //   this.owner.register('service:view', viewStub, { instantiate: false });
  //   this.owner.register('service:router', routerStub, { instantiate: false });

  //   await render(hbs`<ViewComponent />`);
  //   await this.element.querySelector('button').click();
  //   assert.expect('applyPreservedScrollPosition called on view service');
  // });
});

import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | top-bar', function (hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<TopBar />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <TopBar>
        template block text
      </TopBar>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});

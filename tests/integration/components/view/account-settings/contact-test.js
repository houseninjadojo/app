import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { stubService } from '@glimmer/tracking';

module(
  'Integration | Component | View | Account Settings | contact',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      this.set('fields', [
        {
          id: 'field1',
          required: false,
          placeholder: 'Field 1',
          value: '',
          description: 'Field 1 Description',
          label: 'Field 1 Label',
          type: 'text',
          disabled: false,
        },
      ]);
      this.onOpenChatModal = () => {
        assert.expect(true, 'openChatModal action called');
      };
      await render(
        hbs`<View::AccountSettings::Contact @fields={{this.fields}} @openChatModal={{this.onOpenChatModal}}/>`
      );
      assert.ok(this.element.textContent);
    });

    skip('it calls the openChatModal action when the message us button is clicked', async function (assert) {
      this.set('fields', [
        {
          id: 'field1',
          required: false,
          placeholder: 'Field 1',
          value: '',
          description: 'Field 1 Description',
          label: 'Field 1 Label',
          type: 'text',
          disabled: false,
        },
      ]);
      this.onOpenChatModal = () => {
        assert.expect(true, 'openChatModal action called');
      };
      await render(
        hbs`<View::AccountSettings::Contact @fields={{this.fields}} @openChatModal={{this.onOpenChatModal}} />`
      );
      await click('button.underline');
      assert.strictEqual(this.routeName, 'cancel-subscription');
    });

    skip('it calls preservePreviousRoute on the view service and transitions to the selected route when the cancel my subscription button is clicked', async function (assert) {
      this.set('fields', [
        {
          id: 'field1',
          required: false,
          placeholder: 'Field 1',
          value: '',
          description: 'Field 1 Description',
          label: 'Field 1 Label',
          type: 'text',
          disabled: false,
        },
      ]);
      let viewStub = stubService('view', {
        preservePreviousRoute: () => {
          assert.expect(true, 'preservePreviousRoute called on view service');
        },
      });
      let routerStub = stubService('router', {
        transitionTo: (routeName) => {
          assert.srictEqual(
            routeName,
            'cancel-subscription',
            'transitions to correct route'
          );
        },
      });
      this.owner.register('service:view', viewStub);
      this.owner.register('service:router', routerStub);
      this.onOpenChatModal = () => {
        assert.expect(true, 'openChatModal action called');
      };
      await render(
        hbs`<View::AccountSettings::Contact @fields={{this.fields}} @openChatModal={{this.onOpenChatModal}} />`
      );
      await click('button.floating');
    });
  }
);

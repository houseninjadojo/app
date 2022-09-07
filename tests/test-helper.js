import Application from 'houseninja/app';
import config from 'houseninja/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import setupSinon from 'ember-sinon-qunit';
import {
  forceModulesToBeLoaded,
  sendCoverage,
} from 'ember-cli-code-coverage/test-support';

QUnit.done(async function () {
  forceModulesToBeLoaded();
  await sendCoverage();
});

setApplication(Application.create(config.APP));

setup(QUnit.assert);

setupSinon();

start();

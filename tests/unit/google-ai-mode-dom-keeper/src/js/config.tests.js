import * as vitest from 'vitest';
import config from '../../../../../google-ai-mode-dom-keeper/src/js/config.js';
import testHelper from '../../../../test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Config - Unit Testing', describe);

function describe() {
  vitest.it.concurrent(
    'Should expose a strict, immutable lookup dictionary of config',
    test_config_isStrictImmutableDictionary
  );
}

function test_config_isStrictImmutableDictionary() {
  testHelper.testEntityIsImmutableObject(config, 'config', 4);

  const turnSelector = '.CKgc1d[data-scope-id="turn"]';
  const controllerSelector = '[jscontroller="Gtg4Ge#UWxVJd"]';

  vitest.expect(config.keepMax > 1, '\n\'config.keepMax\' must be greater than 1\n').toBe(true);
  vitest.expect(config.turnSelector, `\n'config.turnSelector' must be '${turnSelector}'\n`).toBe(turnSelector);
  vitest.expect(config.controllerSelector, `\n'config.controllerSelector' must be '${controllerSelector}'\n`).toBe(controllerSelector);
}

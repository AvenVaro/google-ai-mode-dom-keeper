import * as vitest from 'vitest';
import config from '../../../../google-ai-mode-dom-keeper/src/config.js';
import testHelper from '../../../test-helper.js';

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
  testHelper.testEntityIsImmutableObject(config, 'config', 3);

  const selector = '.CKgc1d[data-scope-id="turn"]';

  vitest.expect(config.keepMax > 1, '\n\'config.keepMax\' must be greater than 1\n').toBe(true);
  vitest.expect(config.selector, `\n'config.selector' must be '${selector}'\n`).toBe(selector);
}

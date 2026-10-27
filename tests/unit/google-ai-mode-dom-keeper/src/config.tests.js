import * as vitest from 'vitest';
import config from '../../../../google-ai-mode-dom-keeper/src/config.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Config - Unit Testing', describe);

function describe() {
  vitest.it.concurrent(
    'Should expose a strict, immutable lookup dictionary of config',
    test_token_isStrictImmutableDictionary
  );
}

function test_token_isStrictImmutableDictionary() {
  vitest.expect(Object.isFrozen(config)).toBe(true);

  vitest.expect(config.globalKey).toBe('__GOOGLE_AI_MODE_DOM_KEEPER__');
  vitest.expect(config.keepMax).toBe(4);
  vitest.expect(config.selector).toBe('.CKgc1d[data-scope-id="turn"]');

  vitest.expect(Object.keys(config)).toHaveLength(3);
}

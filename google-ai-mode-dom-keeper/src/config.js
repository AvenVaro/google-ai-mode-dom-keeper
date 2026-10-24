'use strict';

//================================
// Typedefs
//================================

/**
 * @typedef {import('./config.d.ts').Config} Config
 */

//================================
// Constants
//================================

/** @type {Config} */
const config = Object.freeze({
  globalKey: '__GOOGLE_AI_MODE_DOM_KEEPER__',
  selector: '.CKgc1d[data-scope-id="turn"]',
  keepMax: 4
});

//================================
// Exports
//================================

export default config;

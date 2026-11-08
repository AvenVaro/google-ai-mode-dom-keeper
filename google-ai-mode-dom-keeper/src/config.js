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
  turnSelector: '.CKgc1d[data-scope-id="turn"]',
  controllerSelector: '[jscontroller="Gtg4Ge#UWxVJd"]',
  keepMax: 4
});

//================================
// Exports
//================================

export default config;

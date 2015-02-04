/**
 * filter-web-colors <https://github.com/tunnckoCore/filter-web-colors>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var mm = require('micromatch');
var typeOf = require('kind-of');
var isHex = require('is-hex-color');
var isGlob = require('is-glob');
var filterObject = require('filter-object');
var filterValues = require('filter-values');
var filterKeys = require('filter-keys');

module.exports = function filterWebColors(colors, patterns, options) {
  var len = arguments.length;
  if (!len) {
    throw new TypeError('filter-web-colors: expects at least one argument');
  }
  options = options || {
    names: false,
    hex: false
  };

  if (len === 1) {
    patterns = colors;
    colors = require('css-color-names') || {};
    options = options;
  }

  if (len === 2) {
     if (typeOf(patterns) === 'object') {
       options = patterns;
       patterns = colors;
       colors = require('css-color-names') || {};
     }
  }

  if (typeOf(colors) === 'object' && typeOf(patterns) === 'object') {
    throw new TypeError('filter-web-colors: `patterns` should be string|array|fn');
  }

  if (typeOf(colors) !== 'object' && typeOf(colors) !== 'array') {
    throw new TypeError('filter-web-colors: `colors` should be string|array');
  }

  if (typeOf(colors) === 'object') {
    if (typeOf(patterns) === 'array') {
      // todo
    }

    if (colors.hasOwnProperty(patterns)) {
      return colors[patterns];
    }

    if (isHex(patterns) || patterns.charAt(0) === '#' && isGlob(patterns)) {
      return filterValues(colors, patterns);
    }

    if (isGlob(patterns)) {
      return filterKeys(colors, patterns);
    }

    return filterObject(colors, patterns, options);
  }

  if (typeOf(patterns) === 'function') {
    return colors.filter(patterns);
  }

  return mm(colors, patterns, options);
};

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rtttlPlay"] = factory();
	else
		root["rtttlPlay"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  parse: parse,
  getName: getName,
  getDefaults: getDefaults,
  getData: getData
};

/**
 * Parse RTTTL
 *
 * @param {string} rtttl - RTTTL String
 * @returns {object} - An object specifying frequency and duration for each note
 */
function parse(rtttl) {

  var REQUIRED_SECTIONS_NUM = 3;
  var SECTIONS = rtttl.split(':');

  if (SECTIONS.length !== REQUIRED_SECTIONS_NUM) {
    throw new Error('Invalid RTTTL file.');
  }

  var NAME = getName(SECTIONS[0]);
  var DEFAULTS = getDefaults(SECTIONS[1]);
  var MELODY = getData(SECTIONS[2], DEFAULTS);

  return {
    name: NAME,
    defaults: DEFAULTS,
    melody: MELODY
  };
}

/**
 * Get ring tone name
 *
 * @param {string} name
 * @returns {string}
 */
function getName(name) {

  var MAX_LENGTH = 10;

  if (name.length > MAX_LENGTH) {
    console.warn('Tune name should not exceed 10 characters.');
  }

  if (!name) {
    return 'Unknown';
  }

  return name;
}

/**
 * Get duration, octave and BPM
 *
 * @param {string} defaults
 * @returns {object}
 */
function getDefaults(defaults) {

  var VALUES = defaults.split(',');

  var VALUES_ARR = VALUES.map(function (value) {

    if (value === '') {
      return {};
    }

    var KEY_VAL = value.split('=');

    if (KEY_VAL.length !== 2) {
      throw new Error('Invalid setting ' + value);
    }

    var KEY = KEY_VAL[0];
    var VAL = KEY_VAL[1];

    var ALLOWED_DURATION = ['1', '2', '4', '8', '16', '32'];
    var ALLOWED_OCTAVE = ['4', '5', '6', '7'];
    var ALLOWED_BPM = ['25', '28', '31', '35', '40', '45', '50', '56', '63', '70', '80', '90', '100', '112', '125', '140', '160', '180', '200', '225', '250', '285', '320', '355', '400', '450', '500', '565', '635', '715', '800', '900'];

    switch (KEY) {
      case 'd':
        if (ALLOWED_DURATION.indexOf(VAL) !== -1) {
          return { duration: VAL };
        } else {
          throw new Error('Invalid duration ' + VAL);
        }
      case 'o':
        if (ALLOWED_OCTAVE.indexOf(VAL) === -1) {
          console.warn('Invalid octave ' + VAL);
        }
        return { octave: VAL };
      case 'b':
        if (ALLOWED_BPM.indexOf(VAL) === -1) {
          console.warn('Invalid BPM ' + VAL);
        }
        return { bpm: VAL };
    }
  });

  var VALUES_OBJ = _toObject({}, VALUES_ARR);

  var DEFAULT_VALUES = {
    duration: '4',
    octave: '6',
    bpm: '63'
  };

  return Object.assign(DEFAULT_VALUES, VALUES_OBJ);
}

/**
 * Convert an array of objects into an object
 *
 * @param {object} obj
 * @param {Array} arr
 * @returns {object}
 * @private
 */
function _toObject(obj, arr) {

  if (arr.length === 0) {
    return obj;
  }

  var newObj = Object.assign(obj, arr[0]);

  return _toObject(newObj, arr.slice(1));
}

/**
 * Get the parsed melody data
 *
 * @param {string} melody
 * @param {object} defaults
 * @returns {Array}
 */
function getData(melody, defaults) {

  var NOTES = melody.split(',');
  var BEAT_EVERY = 60000 / parseInt(defaults.bpm);

  return NOTES.map(function (note) {

    var NOTE_REGEX = /(1|2|4|8|16|32|64)?((?:[a-g]|h|p)#?){1}(\.?)(4|5|6|7)?/;
    var NOTE_PARTS = note.match(NOTE_REGEX);

    var NOTE_DURATION = NOTE_PARTS[1] || parseInt(defaults.duration);
    var NOTE = NOTE_PARTS[2] === 'h' ? 'b' : NOTE_PARTS[2];
    var NOTE_DOTTED = NOTE_PARTS[3] === '.';
    var NOTE_OCTAVE = NOTE_PARTS[4] || parseInt(defaults.octave);

    return {
      note: NOTE,
      duration: _calculateDuration(BEAT_EVERY, parseFloat(NOTE_DURATION), NOTE_DOTTED),
      frequency: _calculateFrequency(NOTE, NOTE_OCTAVE)
    };
  });
}

/**
 * Calculate the frequency of a note
 *
 * @param {string} note
 * @param {number} octave
 * @returns {number}
 * @private
 */
function _calculateFrequency(note, octave) {

  if (note === 'p') {
    return 0;
  }

  var C4 = 261.63;
  var TWELFTH_ROOT = Math.pow(2, 1 / 12);
  var N = _calculateSemitonesFromC4(note, octave);
  var FREQUENCY = C4 * Math.pow(TWELFTH_ROOT, N);

  return Math.round(FREQUENCY * 1e1) / 1e1;
}

function _calculateSemitonesFromC4(note, octave) {

  var NOTE_ORDER = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  var MIDDLE_OCTAVE = 4;
  var SEMITONES_IN_OCTAVE = 12;

  var OCTAVE_JUMP = (octave - MIDDLE_OCTAVE) * SEMITONES_IN_OCTAVE;

  return NOTE_ORDER.indexOf(note) + OCTAVE_JUMP;
}

/**
 * Calculate the duration a note should be played
 *
 * @param {number} beatEvery
 * @param {number} noteDuration
 * @param {boolean} isDotted
 * @returns {number}
 * @private
 */
function _calculateDuration(beatEvery, noteDuration, isDotted) {
  var DURATION = beatEvery * 4 / noteDuration;
  var PROLONGED = isDotted ? DURATION / 2 : 0;
  return DURATION + PROLONGED;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var rtttlParse = __webpack_require__(0);

module.exports = {
  play: play,
  stop: stop
};

var shouldStop = false;

function play(rtttl) {

  try {
    var parsedRtttl = rtttlParse.parse(rtttl);
    var audioCtx = new (AudioContext || webkitAudioContext)();
    _playMelody(parsedRtttl.melody, audioCtx);
  } catch (err) {
    alert(err);
  }
}

function stop() {
  shouldStop = true;
}

function _playMelody(melody, audioCtx) {

  if (shouldStop) {
    shouldStop = false;
    return;
  }

  var osc = audioCtx.createOscillator();
  osc.type = 'triangle';
  osc.start(0);

  if (melody.length === 0) {
    return;
  }

  var note = melody[0];

  osc.frequency.value = note.frequency;
  osc.connect(audioCtx.destination);

  setTimeout(function () {
    osc.disconnect(audioCtx.destination);
    _playMelody(melody.slice(1), audioCtx, osc);
  }, note.duration);
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.umd.js.map
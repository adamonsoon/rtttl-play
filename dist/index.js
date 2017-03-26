'use strict';

var rtttlParse = require('rtttl-parse');

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
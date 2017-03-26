const rtttlParse = require('rtttl-parse');

module.exports = {
  play,
  stop
};

let shouldStop = false;

function play(rtttl) {

  try {
    const parsedRtttl = rtttlParse.parse(rtttl);
    const audioCtx    = new (AudioContext || webkitAudioContext)();
    _playMelody(parsedRtttl.melody, audioCtx);
  } catch(err) {
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

  const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.start(0);

  if (melody.length === 0) {
    return;
  }

  const note = melody[0];

  osc.frequency.value = note.frequency;
  osc.connect(audioCtx.destination);

  setTimeout(() => {
    osc.disconnect(audioCtx.destination);
    _playMelody(melody.slice(1), audioCtx, osc);
  }, note.duration);

}

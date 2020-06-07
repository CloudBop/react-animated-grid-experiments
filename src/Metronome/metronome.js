// eslint-disable-next-line
import Worker from 'worker-loader!../workers/file.worker.js';
//
export default class Metro {
  // problem here is that all of this is accesible by whoever instantiates the class
  constructor() {
    // - the properties should be private/immutable only called in object
    this.unlock = false;
    this.timerWorker = null;
    // How frequently to call scheduling function  (in milliseconds) 0.025sec ===25
    this.lookahead = 50;
    this.current16th = 0;
    this.nextNoteTime = 0.0;
    this.audioCtx = null;
    // - below is needed for triggering re renders at specific beat in different scope. should be immutable to outside scope though.
    this.nIq = [];
    this.last16thNoteDrawn = -1;
    this.currentNote = 0;
    //
    // mutable state on ui
    this.isPlaying = false;
    this.tempoBpm = 90;
    this.timeSig = '4/4';
    //
    this._16ib = 16;
    this._nR = 2;
  }
  //
  scheduleNote(beat, time) {
    var noteLength = 0.05;
    this.nIq.push({
      note: beat,
      time: time
    });
    // - pit logic for metro resolution here.
    //
    var osc = this.audioCtx.createOscillator();
    var gain = this.audioCtx.createGain(0.8);
    //
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    //
    // metronome resolution
    //
    // we're not playing in 16th notes EG lowercase letters ignored 1e&a 2e&a 3e&a 4e&a
    if (this._nR === 1 && beat % 2) return;
    // we're not playing 8th or 16th notes // ie 4/4
    if (this._nR === 2 && beat % 4) return;
    // only playing wholenotes
    if (this._nR === 3 && beat % this._16ib !== 0) return;
    //
    if (beat % this._16ib === 0) {
      // console.log('beat', beat);
      osc.frequency.value = 880;
    } else if (beat % 4 === 0) {
      osc.frequency.value = 440;
    } else {
      osc.frequency.value = 220;
    }
    //
    osc.start(time);
    osc.stop(time + noteLength);

    //
    // WARNING - THIS WAS IN REQUEST ANIMATION FRAME
    //
    // while (this.nIq.length && this.nIq[0].time < this.audioCtx.currentTime) {
    //   this.currentNote = this.nIq[0].note;
    //   this.nIq.splice(0, 1); // remove note from queue
    // }
  }
  //
  nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / this.tempoBpm;
    this.nextNoteTime += 0.25 * secondsPerBeat;
    this.current16th++;
    // Moduleous here for time sig
  }
  //
  scheduler() {
    var scheduleAheadTime = 0.5; // How far ahead to schedule audio (sec)
    // This is calculated from lookahead, and overlaps
    // with next interval (in case the timer is late)
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioCtx.currentTime + scheduleAheadTime) {
      this.scheduleNote(this.current16th, this.nextNoteTime);
      this.nextNote();
    }
  }
  //
  //
  //
  //
  //
  //
  init() {
    // test runtime for web audio API
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      // for ios, plays a silent sound to respond to future evts.
      if (!this.unlock) {
        // play silent buffer to unlock the audio
        var buffer = this.audioCtx.createBuffer(1, 1, 22050);
        var node = this.audioCtx.createBufferSource();
        node.buffer = buffer;
        node.start(0);
        this.unlock = true;
      }
    } catch (e) {
      console.log(e);
      alert('Web Audio API is not supported in this browser');
    }
    //
    //
    // test run time for timerworker
    try {
      this.timerWorker = new Worker('js/worker.js');
      // when isPlaying call this every ...
      this.timerWorker.onmessage = e => {
        if (e.data === 'tick') {
          // console.log(e.data)
          this.scheduler();
        } else console.log('message: ' + e.data);
      };
      //
      this.timerWorker.postMessage({ interval: this.lookahead });
      //
    } catch (e) {
      console.log(e);
      alert('Something went wrong with the web worker');
    }
    console.log('METRONOME INITIALISED');
  }
  //
  terminate() {
    if (this.isPlaying) {
      this.play();
      this.isPlaying = false;
      this.nIq = [];
      this.current16th = 0;
      this.nextNoteTime = 0.0;
      this.currentNote = 0;
    }
    // cancelAnimationFrame(animationFrame);
    if (this.timerWorker !== null) {
      console.log("TimerWorker is On let's turn it off...");
      this.timerWorker.postMessage('stop');
      setTimeout(() => {
        this.timerWorker = null;
      }, 1000);
    }
    if (this.audioCtx !== null) {
      console.log('Audio is On Lets turn it off...');
      this.audioCtx = null;
    }
    //
    this.unlock = false;
  }
  //
  // printTempo(el) {
  //   el.innerHTML = this.tempoBpm;
  //   return;
  // }
  play() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      // for first beat
      this.nextNoteTime = this.audioCtx.currentTime + 0.15;
      //
      this.timerWorker.postMessage('start');
    }
    // else {
    //   this.timerWorker.postMessage('stop');
    // }
    //
    return this.isPlaying ? 'stop' : 'start';
  }

  stop() {
    //
    console.log('before reset');
    console.log(this);
    //
    this.timerWorker.postMessage('stop');
    this.nIq = [];
    this.isPlaying = false;
    this.current16th = 0;
    this.nextNoteTime = 0.0;
    this.currentNote = 0;
    return 'play';
  }
  //
  incTemp() {
    return ++this.tempoBpm;
  }
  //
  decTemp() {
    return --this.tempoBpm;
  }
  //
  setTimeSig(timeSig) {
    // console.log(timeSig);
    // VALIDATE
    switch (timeSig) {
      case '1/4':
        // only whole beats
        this._nR = 3;
        this._16ib = 16;
        return;
      case '2/4':
        // Only Quarters
        this._nR = 2;
        this._16ib = 8;
        return;
      case '3/4':
        // Only Quarters
        this._nR = 2;
        this._16ib = 12;
        return;
      case '4/4':
        // Only Quarters
        this._nR = 2;
        this._16ib = 16;
        return;
      case '5/4':
        // Only Quarters
        this._nR = 2;
        this._16ib = 20;
        return;
      case '6/4':
        // Only Quarters
        this._nR = 2;
        this._16ib = 24;
        return;
      case '6/8':
        // Quarters + 8ths
        this._nR = 1;
        this._16ib = 24;
        return;
      case '12/8':
        // Quarters + 8ths
        this._nR = 1;
        this._16ib = 48;
        return;
      default:
        break;
    }
  }
}

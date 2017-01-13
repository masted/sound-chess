var WIDTH = 50;
var HEIGHT = 50;

// Interesting parameters to tweak!
var SMOOTHING = 0.8;
var FFT_SIZE = 2048;

function Visualizer(canvas, sound) {
  this.canvas = canvas;
  this.analyser = context.createAnalyser();

  this.analyser.connect(context.destination);
  this.analyser.minDecibels = -140;
  this.analyser.maxDecibels = 0;
  loadSounds(this, {
    buffer: sound
  }, onLoaded);
  this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
  this.times = new Uint8Array(this.analyser.frequencyBinCount);

  function onLoaded() {
    var button = document.querySelector('button');
    button.removeAttribute('disabled');
    button.innerHTML = 'Play/pause';
  };

  this.isPlaying = false;
  this.startTime = 0;
  this.startOffset = 0;
}

// Toggle playback
Visualizer.prototype.togglePlayback = function() {
  if (this.isPlaying) {
    // Stop playback
    this.source[this.source.stop ? 'stop': 'noteOff'](0);
    this.startOffset += context.currentTime - this.startTime;
    console.log('paused at', this.startOffset);
    // Save the position of the play head.
  } else {
    this.startTime = context.currentTime;
    console.log('started at', this.startOffset);
    this.source = context.createBufferSource();
    // Connect graph
    this.source.connect(this.analyser);
    this.source.buffer = this.buffer;
    this.source.loop = true;
    // Start playback, but make sure we stay in bound of the buffer.
    this.source[this.source.start ? 'start' : 'noteOn'](0, this.startOffset % this.buffer.duration);
    // Start visualizer.
    requestAnimFrame(this.draw.bind(this));
  }
  this.isPlaying = !this.isPlaying;
}


Visualizer.prototype.draw = function() {
  this.analyser.smoothingTimeConstant = SMOOTHING;
  this.analyser.fftSize = FFT_SIZE;
  // Get the frequency data from the currently playing music
  this.analyser.getByteFrequencyData(this.freqs);
  this.analyser.getByteTimeDomainData(this.times);
  var width = Math.floor(1/this.freqs.length, 10);
  var drawContext = this.canvas.getContext('2d');
  this.canvas.width = WIDTH;
  this.canvas.height = HEIGHT;
  // Draw the frequency domain chart.
  for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
    var value = this.freqs[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH/this.analyser.frequencyBinCount;
    var hue = i/this.analyser.frequencyBinCount * 360;
    hue = 200;
    drawContext.fillStyle = '#fff';
    drawContext.fillRect(i * barWidth, offset, barWidth, height);
  }
  if (this.isPlaying) {
    requestAnimFrame(this.draw.bind(this));
  }
}

Visualizer.prototype.getFrequencyValue = function(freq) {
  var nyquist = context.sampleRate/2;
  var index = Math.round(freq/nyquist * this.freqs.length);
  return this.freqs[index];
}
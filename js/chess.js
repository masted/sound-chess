var tracking = [
  'tracking/chess110_6_BASS.wav',
  'tracking/chess110_6_BASS2.wav',
  'tracking/chess110_6_BREAKZ.wav',
  'tracking/chess110_6_BREAKZ@2.wav',
  'tracking/chess110_6_DELAYKICK.wav',
  'tracking/chess110_6_EUPHORIAPAD.wav',
  'tracking/chess110_6_GLITCHMACHINE.wav',
  'tracking/chess110_6_HAT.wav',
  'tracking/chess110_6_KICKLOW.wav',
  'tracking/chess110_6_LEAD.wav',
  'tracking/chess110_6_ORGANIC.wav',
  'tracking/chess110_6_PAD.wav',
  'tracking/chess110_6_PADSAMPLE2.wav',
  'tracking/chess110_6_PLASTIC.wav',
  'tracking/chess110_6_PSYZAP.wav',
  'tracking/chess110_6_sampleend.wav',
  'tracking/chess110_6_STARTAMBIENT.wav',
  'tracking/chess110_6_SYNTH.wav'
];
for (var i =0; i<tracking.length; i++) {
  //tracking[i] = new Audio(tracking[i]);
}

var chess = document.getElement('.chess');

var canvases = [];
var row;
var color = 0;
var n = 0;
for (var i = 0; i < 8; i++) {
  for (var j = 0; j < 8; j++) {
    if (i % 2) color = j % 2 ? 0 : 1;
    else color = j % 2 ? 1 : 0;
    if (j == 0) {
      row = new Element('div.row').inject(chess);
    }
    (function (n) {
      canvases.push(new Element('canvas.sq.' + (color ? 'white' : 'black')).inject(row));
    })(n);
    n++;
  }
}
var sample = new Visualizer(canvases[0], 'tracking/chess110_6_KICKLOW.wav');
document.querySelector('button').addEventListener('click', function () {
  sample.togglePlayback()
});

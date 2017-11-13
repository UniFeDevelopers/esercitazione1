'use strict';

var vertexShaderSource = '\n  attribute vec4 a_Position;\n  attribute vec4 a_Color;\n  varying vec4 v_Color;\n  void main() {\n    gl_Position = a_Position;\n    v_Color = a_Color;\n  }\n';

var fragmentShaderSource = '\n  precision mediump float;\n  varying vec4 v_Color;\n  void main() {\n    gl_FragColor = v_Color;\n  }\n';

var canvas = document.querySelector('canvas#webgl-es1');
var height = window.innerHeight;
var width = window.innerWidth;

var rects = [];
var clickBuff = [];

var a_Position = void 0;
var a_Color = void 0;

var addClickToRects = function addClickToRects() {
  if (clickBuff.length && clickBuff.length % 2 === 0) {
    var click1 = clickBuff.pop();
    var click2 = clickBuff.pop();

    var colorR = ((click1.color & 0xff0000) >> 16) / 256;
    var colorG = ((click1.color & 0x00ff00) >> 8) / 256;
    var colorB = (click1.color & 0x0000ff) / 256;
    var colorA = 1.0;

    var color = [colorR, colorG, colorB, colorA];

    rects.push.apply(rects, [click1.x, click1.y].concat(color, [click2.x, click2.y], color, [click1.x, click2.y], color, [click1.x, click1.y], color, [click2.x, click2.y], color, [click2.x, click1.y], color));

    return true;
  }

  return false;
};

var toggleWaitingSecondClick = function toggleWaitingSecondClick() {
  var body = document.querySelector('body');
  if (clickBuff.length) {
    body.setAttribute('style', 'cursor: crosshair');
  } else {
    body.removeAttribute('style');
  }
};

canvas.addEventListener('click', function (e) {
  clickBuff.push({
    x: 2 * e.clientX / width - 1,
    y: -2 * e.clientY / height + 1,
    color: parseInt('0x' + document.querySelector('input#color-input').value.substr(1))
  });

  if (addClickToRects(clickBuff, rects)) {
    draw();
  }
  toggleWaitingSecondClick();
});

document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.keyCode == 90 && rects.length > 0) {
    if (rects.length % 2 === 0) {
      clickBuff.pop();
      clickBuff.pop();
      draw();
    } else {
      clickBuff.pop();
    }
  }
});

var init = function init(canvas, height, width) {
  canvas.width = width;
  canvas.height = height;
  var gl = getWebGLContext(canvas);
  if (!gl) return;
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) return;

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  a_Color = gl.getAttribLocation(gl.program, 'a_Color');

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return gl;
};

var draw = function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  var buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rects), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 6 * 4, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 6 * 4, 2 * 4);
  gl.enableVertexAttribArray(a_Color);
  gl.drawArrays(gl.TRIANGLES, 0, rects.length / 6);
};

var gl = init(canvas, height, width);
'use strict';

var vertexShaderSource = '\n  void main() {\n  }\n';

var fragmentShaderSource = '\n  precision mediump float;\n  void main() {\n  }\n';

var canvas = document.querySelector('canvas#webgl-es2');
var height = window.innerHeight;
var width = window.innerWidth;

var init = function init(canvas, height, width) {
  canvas.width = width;
  canvas.height = height;
  var gl = getWebGLContext(canvas);
  if (!gl) return;
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) return;

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return gl;
};

var draw = function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
};

var gl = init(canvas, height, width);
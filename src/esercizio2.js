const vertexShaderSource = `
  void main() {
  }
`

const fragmentShaderSource = `
  precision mediump float;
  void main() {
  }
`

const canvas = document.querySelector('canvas#webgl-es2')
const height = window.innerHeight
const width = window.innerWidth

const init = (canvas, height, width) => {
  canvas.width = width
  canvas.height = height
  var gl = getWebGLContext(canvas)
  if (!gl) return
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) return

  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  return gl
}

const draw = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const gl = init(canvas, height, width)

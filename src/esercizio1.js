const vertexShaderSource = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  void main() {
    gl_Position = a_Position;
    v_Color = a_Color;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`

const canvas = document.querySelector('canvas#webgl-es1')
const height = window.innerHeight
const width = window.innerWidth

let rects = []
let clickBuff = []

let a_Position
let a_Color

const addClickToRects = () => {
  if (clickBuff.length && clickBuff.length % 2 === 0) {
    const click1 = clickBuff.pop()
    const click2 = clickBuff.pop()

    const colorR = ((click1.color & 0xff0000) >> 16) / 256
    const colorG = ((click1.color & 0x00ff00) >> 8) / 256
    const colorB = (click1.color & 0x0000ff) / 256
    const colorA = 1.0

    const color = [colorR, colorG, colorB, colorA]

    let rect = [
      click1.x,
      click1.y,
      ...color,
      click2.x,
      click2.y,
      ...color,
      click1.x,
      click2.y,
      ...color,
      click1.x,
      click1.y,
      ...color,
      click2.x,
      click2.y,
      ...color,
      click2.x,
      click1.y,
      ...color,
    ]

    rects.push(rect)

    return true
  }

  return false
}

const toggleWaitingSecondClick = () => {
  const body = document.querySelector('body')
  if (clickBuff.length) {
    body.setAttribute('style', 'cursor: crosshair')
  } else {
    body.removeAttribute('style')
  }
}

canvas.addEventListener('click', e => {
  clickBuff.push({
    x: 2 * e.clientX / width - 1,
    y: -2 * e.clientY / height + 1,
    color: parseInt('0x' + document.querySelector('input#color-input').value.substr(1)),
  })

  if (addClickToRects(clickBuff, rects)) {
    draw()
  }
  toggleWaitingSecondClick()
})

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.code == 'KeyZ' && rects.length > 0) {
    if (clickBuff.length > 0) {
      clickBuff.pop()
    } else {
      rects.pop()
      draw()
    }

    toggleWaitingSecondClick()
  }
})

const init = (canvas, height, width) => {
  canvas.width = width
  canvas.height = height
  var gl = getWebGLContext(canvas)
  if (!gl) return
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) return

  a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  a_Color = gl.getAttribLocation(gl.program, 'a_Color')

  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  return gl
}

const draw = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  for (let rect of rects) {
    let buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect), gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 6 * 4, 0)
    gl.enableVertexAttribArray(a_Position)
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 6 * 4, 2 * 4)
    gl.enableVertexAttribArray(a_Color)
    gl.drawArrays(gl.TRIANGLES, 0, rect.length / 6)
  }
}

const gl = init(canvas, height, width)

/*
  Esercitazione 1 - Esercizio 1

  Gruppo:
    - Bulzoni Federico
    - Guerra Antonio
    - Zambello Nicola

*/

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
  // se ci sono 2 o più click nel array dei click,
  // preleva due click e, calcolando le coordinate dei quattro vertici
  // e le quattro componenti del colore, aggiunge il nuovo rettangolo
  // all'array dei rettangoli

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
  // cambia il cursore in base allo stato:
  // se l'utente ha aggiunto il primo click,
  // setta il cursore a croce per dare feedback
  // altrimenti lo resetta

  const body = document.querySelector('body')
  if (clickBuff.length) {
    body.setAttribute('style', 'cursor: crosshair')
  } else {
    body.removeAttribute('style')
  }
}

canvas.addEventListener('click', e => {
  // aggiunge un click all'array
  clickBuff.push({
    x: 2 * e.clientX / width - 1,
    y: -2 * e.clientY / height + 1,
    color: parseInt('0x' + document.querySelector('input#color-input').value.substr(1)),
  })

  // chiama la funzione che gestisce l'array dei rettangoli
  if (addClickToRects(clickBuff, rects)) {
    // se ha aggiunto un rettangolo, ri-disegna tutto
    draw()
  }

  // chiama la funzione che gestisce il cursore in base allo stato
  toggleWaitingSecondClick()
})

document.addEventListener('keydown', e => {
  // se è stato premuto il tasto z con il modificatore Ctrl,
  // ed è stato aggiunto solo il primo dei due click,
  // allora viene rimosso un click dall’array dei click,
  // altrimenti viene rimosso un rettangolo dall’array dei rettangoli

  if (e.ctrlKey && e.code == 'KeyZ') {
    if (clickBuff.length > 0) {
      clickBuff.pop()
    } else if (rects.length > 0) {
      rects.pop()
      draw()
    }

    // chiama la funzione che gestisce il cursore in base allo stato
    toggleWaitingSecondClick()
  }
})

const init = (canvas, height, width) => {
  canvas.width = width
  canvas.height = height

  // inizializza la canvas per il contesto WebGL
  var gl = getWebGLContext(canvas)
  if (!gl) return

  // inizializza gli shaders
  if (!initShaders(gl, vertexShaderSource, fragmentShaderSource)) return

  a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  a_Color = gl.getAttribLocation(gl.program, 'a_Color')

  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  return gl
}

const draw = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  // crea n buffer in cui vengono salvati i valori
  // dei singoli rettangoli per disegnarli con drawArrays
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

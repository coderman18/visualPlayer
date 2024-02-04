// задаем растояние между колонками
const columnGap = 2
const columnCount = 512 // кол-во колонок: 1024, 512, 256, 128, 64

const canvas = document.getElementById('player__fireplace')
const ctx = canvas.getContext('2d')

const player = document.getElementById('audio-player')

// визуализация аудио
let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
let source = audioCtx.createMediaElementSource(player);
let analyser = audioCtx.createAnalyser();
analyser.fftSize = columnCount;
source.connect(analyser); // подключаем анализатор к элементу аудио
analyser.connect(audioCtx.destination); // без этой строки нет звука, но анализатор работает
let frequencyData = new Uint8Array(analyser.frequencyBinCount);

document.getElementById('player__btn').addEventListener('click', function() {
  if (!this.classList.contains('play-btn__play')) {
    player.play()
    this.textContent = "Pause"
    this.classList.add('play-btn__play')
  } else {
    player.pause()
    this.textContent = "Play"
    this.classList.remove('play-btn__play')
  }
})

window.addEventListener('resize', resizeCanvas, false)
// функция 100% ширины экрана
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()


// рисуем колонку
function drawColumn(x, width, height) {
  const gradient = ctx.createLinearGradient(0, canvas.height - height / 2, 0, canvas.height);
  gradient.addColorStop(1, "rgb(243, 225, 58)");
  gradient.addColorStop(0.9, "rgb(243, 118, 34)");
  gradient.addColorStop(0, "rgba(247, 11, 11, 0.78)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, canvas.height - height / 2, width, height)
}

// анимация

function render() {
  analyser.getByteFrequencyData(frequencyData); // записываем в массив данные уровней частот
  

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const columnWidth = (canvas.width / frequencyData.length) - columnGap + (columnGap / frequencyData.length) // ширина колонки

  const heightScale = canvas.height / 100; // масштабный коффициент

  let xPos = 0

  for (let i = 0; i < frequencyData.length; i++) {
    let columnHeight = frequencyData[i] * heightScale

    drawColumn(xPos, columnWidth, columnHeight / 2)

    xPos += columnWidth + columnGap
  }

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)

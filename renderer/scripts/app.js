/* global Jscii */

const videoPlayer = document.getElementById('video')
const printButton = document.getElementById('print')
const asciiContainer = document.getElementById('ascii-container-video')
const canvas = document.getElementById('video-output-img')
const context = canvas.getContext('2d')

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        videoPlayer.srcObject = stream
        videoPlayer.play()
    })
}

new Jscii({
    container: asciiContainer,
    el: videoPlayer,
})

printButton.addEventListener('click', () => {
    outputASCIIImage()
})

function outputASCIIImage() {
    context.drawImage(videoPlayer, 0, 0, 640, 480)
    let image = new Image()
    image.src = canvas.toDataURL('image/png')
    image.id = 'ascii-input-img'

    document.body.appendChild(image)

    new Jscii({
        width: 100,
        el: document.getElementById('ascii-input-img'),
        fn: function(str) {
            document.getElementById('ascii-output-img').innerHTML = str
        },
    })

    document.body.removeChild(image)
}

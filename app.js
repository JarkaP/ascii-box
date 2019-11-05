/* global domtoimage Jscii */

const videoPlayer = document.getElementById('video')
const printButton = document.getElementById('print')
const asciiContainer = document.getElementById('ascii-container-video')

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
    domtoimage
        .toSvg(asciiContainer)
        .then(function(dataUrl) {
            var link = document.createElement('a')
            link.download = 'ascii.svg'
            link.href = dataUrl
            link.click()
        })
        .catch(function(error) {
            console.error('oops, something went wrong!', error)
        })
})

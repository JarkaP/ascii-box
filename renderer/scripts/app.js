/* global Jscii html2pdf */

const videoPlayer = document.getElementById('video')
const printButton = document.getElementById('print')
const asciiContainer = document.getElementById('ascii-container-video')
const canvas = document.getElementById('video-output-img')
const context = canvas.getContext('2d')

const fs = require('fs')
const printer = require('pdf-to-printer')

const pdfPath = require('os').tmpdir() + '/ascii.pdf'

const pdfOptions = {
    filename: 'ascii.pdf',
    image: { type: 'jpeg', quality: 1 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    margin: 0,
}

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
    context.drawImage(videoPlayer, 0, 0, 600, 450)
    let image = new Image()
    image.src = canvas.toDataURL('image/png')
    image.id = 'ascii-input-img'

    document.body.appendChild(image)

    new Jscii({
        width: 100,
        el: document.getElementById('ascii-input-img'),
        fn: function(str) {
            let output = document.getElementById('ascii-output-img')
            output.innerHTML = str
            print(output)
        },
    })

    document.body.removeChild(image)
}

function createPdf(output) {
    html2pdf()
        .set(pdfOptions)
        .from(output)
        .toPdf()
        .output('datauristring')
        .then(pdfAsString => {
            fs.writeFile(
                pdfPath,
                pdfAsString.split(';base64,').pop(),
                { encoding: 'base64' },
                function(err) {
                    if (err) {
                        return alert(err)
                    }

                    printPdf()
                }
            )
        })
}

function print(output) {
    createPdf(output)
}

function printPdf() {
    printer
        .print(pdfPath)
        .then(console.log)
        .catch(console.error)
}

const ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('printPDF', (event, content) => {
    document.body.innerHTML = content

    ipcRenderer.send('readyToPrintPDF')
})

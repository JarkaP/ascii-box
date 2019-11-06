'use strict'

const { app, BrowserWindow, ipcMain, shell } = require('electron')

const os = require('os')
const fs = require('fs')
const path = require('path')

require('electron-reload')(__dirname)

let win
let pdfWin

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadFile('renderer/index.html')

    win.webContents.openDevTools()
        //console.log(path.join(os.tmpdir(), 'print.pdf'))
        // console.log(win.webContents.getPrinters())

    pdfWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
    })

    // https://stackoverflow.com/questions/37627064/how-to-print-a-div-in-electronjs
    pdfWin.loadURL('file://' + __dirname + '/renderer/output.html')

    //workerWindow.hide();
    pdfWin.webContents.openDevTools()
    pdfWin.on('closed', () => {
        pdfWin = undefined
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

// retransmit it to workerWindow
ipcMain.on('printPDF', (event, content) => {
    pdfWin.webContents.send('printPDF', content)
})

// when worker window is ready
ipcMain.on('readyToPrintPDF', event => {
    const pdfPath = path.join(os.tmpdir(), 'print.pdf')

    // Use default printing options
    // https://electronjs.org/docs/api/web-contents#contentsprinttopdfoptions
    pdfWin.webContents.printToPDF({}, function(error, data) {
        if (error) throw error

        fs.writeFile(pdfPath, data, function(error) {
            if (error) {
                throw error
            }
            shell.openItem(pdfPath)
            event.sender.send('wrote-pdf', pdfPath)
        })
    })
})
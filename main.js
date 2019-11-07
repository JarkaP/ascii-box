'use strict'

const { app, BrowserWindow } = require('electron')

const isDev = require('electron-is-dev')

require('electron-reload')(__dirname)

let win

function createWindow() {
    let winOptions = {
        webPreferences: {
            nodeIntegration: true,
        },
    }

    if (!isDev) {
        winOptions.fullscreen = true
        winOptions.frame = false
        winOptions.autoHideMenuBar = true
        winOptions.kiosk = true
    }

    win = new BrowserWindow(winOptions)

    win.loadFile('renderer/index.html')

    if (isDev) {
        win.webContents.openDevTools()
    }
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

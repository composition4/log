const {app, BrowserWindow, webFrame} = require('electron')
const path = require('path')
const url = require('url')

require('electron-reload')(__dirname)

var win

function createWindow () {
  win = new BrowserWindow({width: 1000, height: 610, backgroundColor: '#202020', resizable:true, autoHideMenuBar: true})

  win.loadURL('file://' + __dirname + '/index.html')

  win.on('closed', () => {
    win = null
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
  else{

  }
})

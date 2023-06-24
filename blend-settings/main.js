const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const pty = require("node-pty");

var mainWindow, terminalWindow, packageWindow, ptyProcess

app.commandLine.appendSwitch('enable-transparent-visuals');
app.disableHardwareAcceleration();

require('@electron/remote/main').initialize()

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 600,
    maxWidth: 1000,
    maxHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      enableRemoteModule: true,
      sandbox: false,
      preload: path.join(__dirname, 'src/preload.js')
    },
    autoHideMenuBar: true
  })

  // mainWindow.setMenu(null)

  mainWindow.loadFile('src/index.html')
}

function createTerminalWindow() {
  let t_window_settings = {
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    },
    autoHideMenuBar: true,
    show: false
  }

  if (process.argv.length > 2) {
    if (process.argv[2] == 'package') {
      t_window_settings['frame'] = false
    }
  }

  terminalWindow = new BrowserWindow(t_window_settings)

  terminalWindow.loadFile('src/pages/terminal.html')

  // terminalWindow.setMenu(null)
}

function createPackageWindow() {
  packageWindow = new BrowserWindow({
    minWidth: 450,
    minHeight: 450,
    width: 450,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      sandbox: false
    },
    autoHideMenuBar: true
  })

  packageWindow.loadFile('src/package-installer.html')

  require("@electron/remote/main").enable(packageWindow.webContents)

  // packageWindow.setMenu(null)
}

function loadTerminalWindow(title, cmd) {
  if (terminalWindow.isDestroyed()) {
    createTerminalWindow()
  }

  if (terminalWindow.isVisible() && (title.startsWith('Container: ') && terminalWindow.getTitle().startsWith('Creating container: '))) {
    dialog.showErrorBox('Error opening container window', 'You cannot open a container window while creating a container.')
    return
  }

  if (terminalWindow.isVisible() && title.startsWith('Container: ')) {
    dialog.showErrorBox('Error opening container window', 'You must close any other container windows before opening a new one.')
    return
  }

  if (terminalWindow.isVisible() && (title.startsWith('Creating container: ') && terminalWindow.getTitle().startsWith('Creating container: '))) {
    dialog.showErrorBox('Error creating container', 'You cannot create two containers simultaneously.')
    return
  }

  if (terminalWindow.isVisible() && title.startsWith('Creating container: ')) {
    dialog.showErrorBox('Error creating container', 'You must close the container window before creating a container.')
    return
  }

  terminalWindow.show()

  ipcMain.removeAllListeners('terminal.reset')
  ipcMain.removeAllListeners('terminal.resize')
  ipcMain.removeAllListeners('terminal.keystroke')
  ipcMain.removeAllListeners('terminal.incomingData')
  ipcMain.removeAllListeners('title')

  terminalWindow.removeAllListeners()

  terminalWindow.on('close', e => {
    if (terminalWindow.getTitle().startsWith('Creating container: ')) {
      dialog.showMessageBox(terminalWindow, {
        'type': 'question',
        'title': 'Are you sure?',
        'message': "A container is being created. Closing this window will prevent you from seeing its creation status. Are you sure?",
        'buttons': [
          'Yes',
          'No'
        ]
      }).then((result) => {
        if (result.response === 0) {
          terminalWindow.hide()
          ptyProcess.destroy()
        }
      })
    } else if (terminalWindow.getTitle().startsWith('Package installation')) {
      e.preventDefault()
    } else {
      terminalWindow.hide()
      ptyProcess.destroy()
    }
    e.preventDefault()
  })

  terminalWindow.webContents.send("terminal.reset")

  terminalWindow.webContents.send("title", title);

  ptyProcess = pty.spawn('/bin/bash', ['-c', cmd], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  ptyProcess.on('data', data => {
    if (!terminalWindow.isDestroyed()) {
      terminalWindow.webContents.send("terminal.incomingData", data)
    }
  });
  ptyProcess.on('exit', () => {
    if (!terminalWindow.isDestroyed()) {
      terminalWindow.webContents.send("terminal.reset")
      terminalWindow.hide()
      if (title.startsWith('Creating container: ')) {
        mainWindow.webContents.send("container-created")
      } else if (title.startsWith('Package installation')) {
        packageWindow.webContents.send("installation-complete")
      }
    }
  })
  ipcMain.on("terminal.keystroke", (event, key) => {
    ptyProcess.write(key)
  });
  ipcMain.on("terminal.resize", (event, size) => {
    ptyProcess.resize(size[0], size[1])
  });
}

app.whenReady().then(() => {
  app.allowRendererProcessReuse = false

  if (process.argv.length > 2) {
    if (process.argv[2] == 'package') {
      createPackageWindow()
    }
  } else {
    setTimeout(() => {
      createWindow()
    }, 1000);
  }

  createTerminalWindow()

  ipcMain.on('create-term', (event, data) => {
    loadTerminalWindow(data['title'], data['cmd'])
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
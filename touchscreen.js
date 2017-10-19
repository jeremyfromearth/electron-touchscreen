const ipc = require('electron').ipcRenderer;
ipc.on('set-cursor-visibility', (event, visible) => { 
  if(visible) {
    document.exitPointerLock();
  } else {
    document.body.requestPointerLock();
  }
});

const electron = require('electron');
const ipc = electron.ipcRenderer;

const webFrame = electron.webFrame
webFrame.setZoomLevel(1.0);
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

ipc.on('set-cursor-visibility', (event, visible) => { 
  if(visible) {
    document.exitPointerLock();
  } else {
    document.body.requestPointerLock();
  }
});

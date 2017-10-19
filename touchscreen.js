const ipc = require('electron').ipcRenderer;
ipc.on('set-cursor-visibility', (event, visible) => { 
    document.getElementsByTagName("html")[0].style.cursor = visible ? "auto" : "none";
});

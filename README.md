# electron-touchscreen
Boilerplate for touchscreen or kiosk apps built with Electron.

## Install
```
npm install electron-touchscreen --save
```

## Run the example
```
cd example
npm run start
```

## Basic Usage
```
const path = require('path');
const url = require('url');
const electron = require('electron');

const TouchscreenWindow = require('electron-touchscreen');

let win = null;
const app = electron.app;

app.on('ready', ()=> {
  const demo_url = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file', 
    slashes: true,
  });

  win = new TouchscreenWindow({url: demo_url});
});
```

## Key Commands
* __CMD+K__: Toggles fullscreen
* __CMD+C__: Toggle cursor visibility

// nodejs
const path = require('path');
const url = require('url');

// npm
const electron = require('electron');

// electron-touchscreen
const TouchscreenWindow = require('../index.js');

// vars
let win = null;
const app = electron.app;

// application event handlers
app.on('ready', ()=> {
  const demo_url = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file', 
    slashes: true,
  });

  win = new TouchscreenWindow({url: demo_url, showCursor: true});
});

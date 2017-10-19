/**
 * Electron Touchscreen Window
 * A window object configured specifically for use in touchscreen apps
 * by @jeremyfromearth
 */

// nodejs
const fs = require('fs');
const path = require('path');

// npm
const electron = require('electron');

// vars
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

// default options
const defaults = {
  url: null,
  kiosk: true,
  showCursor: false,
  alwaysOnTop: true,
  simpleFullscreen: true,
  title: "Electron Touchscreen",
  acceptFirstMouse: true,
  backgroundColor: '#000000',
  autoHideMenuBar: true
};

// Some functionality, such as hiding the cursor is best acheived by interacting with the DOM.
// This is taken care of in a file called touchscreen.js that is dynamically loaded into each page.
// We load that file here and save it's contents as a string, to later inject.
let scripts = '';
const filename = path.join(__dirname, 'touchscreen.js');
fs.readFile(filename, 'utf8', (error, data)=> {
  if(error) return;
  scripts = data;
});

class TouchscreenWindow extends BrowserWindow {
  /**
   * @param options Object - see http://goo.gl/teR1Qi for complete docs
   *    We've added a couple extra options
   *    url String - The url of the page to load. Optional, defaults to empty string
   *    showCursor Boolean - Indicates whether or not to display the cursor. Optional, defaults to false
   */
  constructor(options) {
    super(options = Object.assign(defaults, options));
    
    this.first_load = true;
    this.options = options;

    // This is where we inject the page with the scripts from above
    this.webContents.on('dom-ready', (event)=> {
      this.webContents.executeJavaScript(scripts); 
      if(this.first_load && !this.options.showCursor) {
        this.first_load = false;
        this.webContents.send('set-cursor-visibility', this.options.showCursor);
      }
    });

    // Load the first URL if there is one
    if(options.url) this.loadURL(options.url);

    // Set up typical kiosk shortcuts
    globalShortcut.register('CommandOrControl+K', this.toggle_kiosk_mode.bind(this));
    globalShortcut.register('CommandOrControl+C', this.toggle_cursor_visibility.bind(this));
  }

  /**
   * Toggles kiosk mode
   */
  toggle_kiosk_mode() {
    const kiosk = !this.isKiosk();
    this.setKiosk(kiosk);
    this.setAlwaysOnTop(kiosk, 'floating');
    if(!kiosk && !this.options.showCursor) this.toggle_cursor_visibility();
  }

  /**
   * Toggles cursor visibility 
   */
  toggle_cursor_visibility() {
    this.options.showCursor = !this.options.showCursor;
    this.webContents.send('set-cursor-visibility', this.options.showCursor);
  }
};

module.exports = TouchscreenWindow;

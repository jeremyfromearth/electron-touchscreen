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
require('@electron/remote/main').initialize()

// vars
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

// default options
const defaults = {
  url: null,
  kiosk: true,
  showCursor: false,
  alwaysOnTop: true,
  simpleFullscreen: false,
  title: "Electron Touchscreen",
  acceptFirstMouse: true,
  backgroundColor: '#000000',
  autoHideMenuBar: true
};



// Some functionality, such as hiding the cursor is best acheived by interacting with the DOM or Chromium.
// This is taken care of in a file called touchscreen.js that is dynamically injected into each page.
// We load that file here and save it's contents as a string, for later injection.
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

    // Inject the script from above
    this.webContents.on('dom-ready', (event)=> {
      this.set_cursor(this.options.showCursor);
    });

    // Need to set this if we start not in kiosk mode
    if(!this.isKiosk()) this.setAlwaysOnTop(false);

    // Load the first URL if there is one
    if(options.url) this.loadURL(options.url);

    // Set up handlers to add and remove shortcuts on focus and blur
    this.on('focus', (event)=> {
      this.register_shortcuts();
    });

    this.on('blur', (event)=> {
      this.unregister_shortcuts();
    });
  }

  /**
   * Override
   * Sets whether or not this window is in kiosk mode
   * Note: Setting the window to kiosk mode automatically hides the cursor
   */
  setKiosk(value) {
    super.setKiosk(value)
    this.set_cursor(!value);
    this.setVisibleOnAllWorkspaces(value);
    this.setAlwaysOnTop(value, 'normal');
    this.focus();
    this.show();
  }

  /**
   * Sets whether or not to show the cursor
   */
  set_cursor(value) {
    let css = `body{ cursor: ${value ? 'auto' : 'none'}; }`;
    this.webContents.insertCSS(css);
    this.options.showCursor = value;
  }

  register_shortcuts() {
    globalShortcut.register('CommandOrControl+K', ()=>{
      if(this.isFocused()) {
        super.setKiosk(!this.isKiosk())
      }
    });

    globalShortcut.register('CommandOrControl+C', ()=>{
      if(this.isFocused()) {
        this.set_cursor(!this.options.showCursor)
      }
    });
  }

  unregister_shortcuts() {
    globalShortcut.unregister('CommandOrControl+K');
    globalShortcut.unregister('CommandOrControl+C');
  }
};

module.exports = TouchscreenWindow;

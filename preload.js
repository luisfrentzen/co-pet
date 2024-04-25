/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron')
const io = require('socket.io-client');

const socket = io('http://localhost:5000');
console.log(socket)
socket.on('directory', (data) => {
  console.log('Received directory data:', data);
  // Handle the received data here
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })

contextBridge.exposeInMainWorld('electronAPI', {
  petStep: (dx, dy) => ipcRenderer.invoke('pet-step', dx, dy),
  socket: socket
})

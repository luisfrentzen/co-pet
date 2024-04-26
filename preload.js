/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandboxF
 */
const { contextBridge, ipcRenderer } = require('electron')
const io = require('socket.io-client');

const socket = io('http://localhost:5000');
socket.on('directory', (data) => {
  console.log('Received directory data:', data);
  // Handle the received data here
});

const apiService = require('./apiService');

contextBridge.exposeInMainWorld('electronAPI', {
  socket: socket,
  screenInfo: () => ipcRenderer.invoke('init-position'),
  petStep: (dx, dy) => ipcRenderer.invoke('pet-step', dx, dy),
  submitMessage: (type, message) => ipcRenderer.send('submit-message', type, message),
  onReceiveMessage: (callback) => ipcRenderer.on('receive-message', (_event, message) => callback(message))
})

contextBridge.exposeInMainWorld('geminiAPI', {
  apiService: apiService
})

ipcRenderer.on('petPosition', (event, newPosition) => {
  window.dispatchEvent(new CustomEvent('petPosition', { detail: newPosition }));
});
  

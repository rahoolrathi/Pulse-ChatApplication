// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld("electronAPI", {
  auth: {
    setToken: (token: string) => ipcRenderer.invoke("auth:set-token", token),
    getToken: () => ipcRenderer.invoke("auth:get-token"),
    clearToken: () => ipcRenderer.invoke("auth:clear-token"),
  },
});
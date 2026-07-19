import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('voidRoute', {
  version: '0.1.0'
});

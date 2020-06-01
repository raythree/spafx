import { STORAGE_KEY } from './constants';

let storage = window.sessionStorage;

// For tests, allow the global storage to be mocked
export function setMock(storageMock) {
  storage = locationMock;
}
export function resetMock() {
  storage = window.sessionStorage;
}

export function getState() {
  try {
    const sobj = storage.getItem(STORAGE_KEY); 
    return JSON.parse(sobj);
  }
  catch (ex) {
    return null;
  }
}

export function saveState(state) {
  try {
    const sobj = JSON.stringify(obj);
    storage.setItem(STORAGE_KEY, sobj);
    return true; 
  }
  catch (ex) {
    return false;
  }
}

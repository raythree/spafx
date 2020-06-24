let enableLogging = false;

export function enableLogging(val) {
  if (val) {
    enableLogging = true;
  }  
}

export function log(message) {
  if (enableLogging) {
    console.log(`spafx: ${message}`);
  }
}


import { getState } from './storage';
import { enableLogging, log} from './log';

// currentState points to the navigation state tree stored in
// sessionStorage. When the first outbound request created it gets
// initialized to that transaction. 

let currentState = null;

// points currentState initially, but always points to a child
// transaction as navigation moves through child transactions.
let currentTransaction = null;

export function initialize(opts) {
  if (opts && opts.enableLogging) {
    enableLogging(true);
  }

  log('initializing');

  

  const initialTxn = getState();
  if (!initialTxn) {
    log('no transactions found');
    return;
  }
}

export function getCurrentTransaction() {
}



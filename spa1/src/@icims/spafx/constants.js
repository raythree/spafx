export const PARAM_PREFIX = 'fx_';

export const STORAGE_KEY = 'spa-fx-key';

// Names of URL params used by framework:
// Transaction ID
export const TXN_PARAM = `${PARAM_PREFIX}txn`;
// Back URL
export const BACK_PARAM = `${PARAM_PREFIX}back`;
// Result parameters returned from called SPA - JSON stringified object
export const RES_PARAM = `${PARAM_PREFIX}res`;
// Indicates a successful return but with no result
export const VOID_PARAM = `${PARAM_PREFIX}void`;
// Error code and values
export const ERR_CODE = `${PARAM_PREFIX}error`;
export const ERR_MSG = `${PARAM_PREFIX}msg`;


export const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const API_URL = 'https://api.dev.nearlogin.io';
export const API_SIGNIN = '/users/login';
export const API_SIGNUP = '/users';
export const API_DASHBOARD_DATA = '/api/dashboard';
export const VALIDATE_TOKEN = '/api/validate_token';
export const API_NFT_LIST = '/nfts/list';
export const API_NFT = '/nfts';
export const API_NFT_COLLECTIONS = '/nfts/collections';
export const VERIFY_PASSCODE = '/users/login/verify';
export const API_TRANSACTION_DATA = '/transactions/list';
export const API_CONTACT = '/contacts';
export const API_IMPORT_CONTACT = (userId: string) => `/contacts/${userId}/import`;
export const API_USER = '/users';
export const API_FETCH_CONTACTS = (userId: string) => `/contacts/${userId}/list`;
export const API_WALLETS = '/wallets';
export const API_FILES = `/wallets`;

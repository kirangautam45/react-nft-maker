import axios, { AxiosRequestConfig } from 'axios';

import { API_URL, REQUEST_HEADERS } from '@/constants/api';

import { IRequestBody } from './service.types';

export const postRequest = (url: string, body: IRequestBody | any, config?: AxiosRequestConfig) => {
  return axios.post(API_URL + url, body, config);
};

export const postRequestWithToken = (
  url: string,
  body: IRequestBody | any,
  token: string,
  config?: AxiosRequestConfig
) => {
  return axios.post(API_URL + url, body, {
    ...config,
    headers: { ...REQUEST_HEADERS, authorization: `${token}`, ...config?.headers },
  });
};

export const putRequest = (url: string, body: IRequestBody | any) => {
  return axios.put(API_URL + url, body);
};

export const getRequest = (url: string, config?: AxiosRequestConfig) => {
  return axios.get(API_URL + url, {
    ...config,
    headers: {
      ...REQUEST_HEADERS,
      ...config?.headers,
    },
  });
};

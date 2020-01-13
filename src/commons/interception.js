/*
 * Created on Mon Dec 10 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */


import axios from 'axios';
import { message } from '@antd-lib';

const USE_MOCK_SERVICE = process.env.USE_MOCK_SERVICE;

// const version = '1.0';
// axios.defaults.baseURL = `/ebm-plus/${version}`;

//设置默认请求头
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
	'Accept': 'application/json',
	'Content-Type': 'application/json;charset=utf-8',
};

axios.defaults.timeout = 10000

axios.interceptors.request.use(function(config) {
  config.url = config.url.replace(/<[\w-_.\\]+>/,  process.env.API || '');

  if(USE_MOCK_SERVICE && config.headers && 'use-mock-service' in config.headers === false) {
    config.headers['use-mock-service'] = true;
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {

  // Do something with response done
  const { data } = response;
  let status = data.errorCode || data.statusCode;
  if(status !== 200) {
    message.warning(data.message)
    return Promise.reject(response);
  }
  return response;
}, function(error) {
  const { response: { data } } = error;
  const info = data.message ? data.message : '发生未知错误';
  message.error(info);
  return Promise.reject(error);
});
const http2 = require('http2');
const { URL } = require('url');
const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');
// Прокси-сервер
// const PROXY_URL = 'http://606d9efb2ca0cbe41f10__cr.ua;state.kyivcity;city.kyiv;zip.03027;asn.200525:93a95ba47dc53f4b@gw.dataimpulse.com:823'; // Укажи свой прокси

async function getStatus() {
  const targetUrl = new URL('https://api.nopecha.com/status?v=0.4.13');

  // Заголовки для запроса
  const headers = {
    ':method': 'GET',
    ':scheme': 'https',
    ':authority': targetUrl.hostname,
    ':path': targetUrl.pathname + targetUrl.search,
    'user-agent': 'curl/7.9.1',
    accept: 'application/json',
    'accept-language': 'en-US,en;q=0.9',
  };

  // const HttpsProxyAgent = require('https-proxy-agent');

  // Прокси-сервер
  const PROXY_URL =
    'http://606d9efb2ca0cbe41f10__cr.ua;state.kyivcity;city.kyiv;zip.03027;asn.200525:93a95ba47dc53f4b@gw.dataimpulse.com:823'; // Укажи свой прокси

  // Создаем агент с прокси
  const agent = new HttpsProxyAgent(PROXY_URL);

  // Отправляем запрос с прокси
  axios({
    method: 'get',
    url: 'https://api.nopecha.com/status?v=0.4.13',
    httpAgent: agent,
    httpsAgent: agent,
  })
    .then((response) => {
      console.log('Ответ от сервера:', response.data);
      // res.json(response.data);
    })
    .catch((error) => {
      console.error('Ошибка запроса через прокси:', error);
      // res.status(500);
    });
}

getStatus();

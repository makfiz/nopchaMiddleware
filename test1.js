// const axios = require('axios');
const http2 = require('http2');
const { URL } = require('url');
const { HttpsProxyAgent } = require('https-proxy-agent');

// Создаем экземпляр клиента HTTP/2

const PROXY_URL = 'http://AT8uNe:kyf3ZAs7UC6u@nproxy.site:10985'; // Укажи здесь свой прокси
async function getStatus() {
  const targetUrl = new URL('https://api.nopecha.com/status?v=0.4.13&key=I-BC8FC98NSD05');

  const headers = {
    ':method': 'GET',
    ':scheme': 'https',
    ':authority': targetUrl.hostname,
    ':path': targetUrl.pathname + targetUrl.search,
    'user-agent': 'curl/8.9.1',
    'accept': '*/*',
  };
  const clientOptions = {};
     if (PROXY_URL) {
        clientOptions.agent = new HttpsProxyAgent(PROXY_URL);
    }
    const client = http2.connect('https://api.nopecha.com', clientOptions);
  try {
     

    const response = await new Promise((resolve, reject) => {
      const req = client.request(headers);
      // console.log("Request Headers:", req.headers);
      let data = '';
          req.on('response', (headers, flags) => {
        console.log("All Request Headers sent:", headers);
      });
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        resolve(data);
      });
      req.on('error', reject);
    });

    console.log(response);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close(); // Закрываем соединение после запроса
  }
}
getStatus()


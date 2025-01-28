// const axios = require('axios');
const http2 = require('http2');
const { URL } = require('url');

// Создаем экземпляр клиента HTTP/2
const client = http2.connect('https://api.nopecha.com');

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

  try {
    // Отправляем запрос с использованием HTTP/2
    const response = await new Promise((resolve, reject) => {
      const req = client.request(headers);
      
      let data = '';
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

getStatus();

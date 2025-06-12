const { URL } = require('url');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = 3000;
const PROXY_URL =
  'http://241203RiD8q-dc-IT:7YwiVt6dyD2UvS2@eu.proxy-jet.io:1010'; // Укажи здесь свой прокси
const unSleepUrl = 'https://bt-statistics-nextjs-ph97.onrender.com/test';

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

function tryCatchWrapper(Fn) {
  return async (req, res, next) => {
    try {
      await Fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

app.get('*', tryCatchWrapper(get));
app.post('/', tryCatchWrapper(post));

async function get(req, res, next) {
  const queryParams = new URLSearchParams(req.query).toString();
  const targetPath = req.path;
  const targetUrl = new URL(
    `https://api.nopecha.com${targetPath}?${queryParams}`
  );
  console.log('Target targetUrl:', targetUrl.toString());

  const headers = {
    ':scheme': 'https',
    ':authority': targetUrl.hostname,
    ':path': targetUrl.pathname + targetUrl.search,
    'user-agent': 'curl/8.9.1',
    accept: '*/*',
  };

  const agent = new HttpsProxyAgent(PROXY_URL);

  axios({
    url: targetUrl,
    httpAgent: agent,
    httpsAgent: agent,
    ...headers,
  })
    .then((response) => {
      console.log('Ответ от сервера:', response.status);
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Ошибка запроса через прокси:', error);
      res.status(500);
    });
}

async function post(req, res, next) {
  const targetUrl = new URL(`https://api.nopecha.com`);
  console.log('Target targetUrl:', targetUrl.toString());

  const headers = {
    ':scheme': 'https',
    ':authority': targetUrl.hostname,
    ':path': targetUrl.pathname + targetUrl.search,
    'user-agent': 'curl/8.9.1',
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const agent = new HttpsProxyAgent(PROXY_URL);
  axios({
    method: 'post',
    data: req.body,
    url: targetUrl,
    httpAgent: agent,
    httpsAgent: agent,
    ...headers,
  })
    .then((response) => {
      console.log('Ответ от сервера:', response.status);
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Ошибка запроса через прокси:', error);
      res.status(500);
    });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  return res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal server errordsfsd' });
});

cron.schedule('*/9 8-20 * * 1-5', async () => {
  try {
    const response = await axios.get(unSleepUrl);
    console.log(
      `[${new Date().toLocaleTimeString()}] Ping successful: ${response.status}`
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `[${new Date().toLocaleTimeString()}] Ping failed: ${
          error.response.status
        }`
      );
    } else {
      console.error(
        `[${new Date().toLocaleTimeString()}] Ping error: ${error.message}`
      );
    }
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

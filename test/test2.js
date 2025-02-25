const { URL } = require('url');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = 3000;
const PROXY_URL =
  'http://606d9efb2ca0cbe41f10__cr.ua;state.kyivcity;city.kyiv;asn.200525:93a95ba47dc53f4b@gw.dataimpulse.com:10000'; // Укажи здесь свой прокси

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
    ':method': 'GET',
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
    ':method': 'POST',
    ':scheme': 'https',
    ':authority': targetUrl.hostname,
    ':path': targetUrl.pathname + targetUrl.search,
    'user-agent': 'curl/8.9.1',
    accept: '*/*',
    'content-type': 'application/json',
  };
  const agent = new HttpsProxyAgent(PROXY_URL);
  let postData = null;
  if (req.body) {
    postData = JSON.stringify(req.body);
  }

  axios({
    data: postData,
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

// app.get('*', async (req, res) => {

// });

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  // if (err.message.includes('Cast to ObjectId failed for value')) {
  //   return res.status(404).json({
  //     message: 'Not found',
  //   });
  // }

  return res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal server errordsfsd' });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

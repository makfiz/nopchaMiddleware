const http2 = require('http2');
const { URL } = require('url');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = 3000;
const PROXY_URL = 'http://606d9efb2ca0cbe41f10__cr.ua;state.kyivcity;city.kyiv;asn.200525:93a95ba47dc53f4b@gw.dataimpulse.com:10000'; // Укажи здесь свой прокси


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
    let client = null
    try {
 const queryParams = new URLSearchParams(req.query).toString();
        const targetPath = req.path;  // Путь из URL
        // console.log('Query Params:', queryParams);
        // console.log('Target Path:', targetPath);
    // const clientIp = req.headers['x-forwarded-for'] 
    const targetUrl = new URL(`https://api.nopecha.com${targetPath}?${queryParams}`);
     console.log('Target targetUrl:', targetUrl.toString());

    const headers = {
        ':method': 'GET',
        ':scheme': 'https',
        ':authority': targetUrl.hostname,
        ':path': targetUrl.pathname + targetUrl.search,
        'user-agent': 'curl/8.9.1',
        'accept': '*/*',
        // 'x-forwarded-for': `${clientIp}`,
        };
    const clientOptions = {};
    
    // Если указан прокси, создаем агент
    //  let agent
    if (PROXY_URL) {
        clientOptions.agent = new HttpsProxyAgent(PROXY_URL);
    }

    // Подключаемся к HTTP/2 серверу
    client = http2.connect('https://api.nopecha.com', clientOptions);
    
        const response = await new Promise((resolve, reject) => {
            const req = client.request(headers);
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', () => resolve(data));
            req.on('error', reject);
            req.end();  
        });
         console.log("response:",response);
           if (response) {
            try {
                const jsonResponse = JSON.parse(response);
                res.json(jsonResponse);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500)
            }
           } else {
            console.error('Empty response from target server');
            res.status(500)
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500)
    } finally {
       if (client) {
            client.close();
        }
    }
}

async function post(req, res, next) {
    let client = null
    try {
//  const queryParams = new URLSearchParams(req.query).toString();
//         const targetPath = req.path;  // Путь из URL
        // console.log('Query Params:', queryParams);
        // console.log('Target Path:', targetPath);
    // const clientIp = req.headers['x-forwarded-for'] 
    const targetUrl = new URL(`https://api.nopecha.com`);
     console.log('Target targetUrl:', targetUrl.toString());

    const headers = {
        ':method': 'POST',
        ':scheme': 'https',
        ':authority': targetUrl.hostname,
        // ':path': targetUrl.pathname + targetUrl.search,
        'user-agent': 'curl/8.9.1',
        'accept': '*/*',
        'content-type': 'application/json'
        // 'x-forwarded-for': `${clientIp}`,
        };
    const clientOptions = {};
    
    // Если указан прокси, создаем агент
    //  let agent
    if (PROXY_URL) {
        clientOptions.agent = new HttpsProxyAgent(PROXY_URL);
    }

    // Подключаемся к HTTP/2 серверу
        client = http2.connect('https://api.nopecha.com', clientOptions);
        let postData = null
        if (req.body) {
        postData = JSON.stringify(req.body);
        }
          
    
        const response = await new Promise((resolve, reject) => {
            const req = client.request(headers);
            req.write(postData); // Отправляем данные в формате JSON
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', () => resolve(data));
            req.on('error', reject);
            req.end();  
        });
         console.log("response:",response);
           if (response) {
            try {
                const jsonResponse = JSON.parse(response);
                res.json(jsonResponse);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500)
            }
           } else {
            console.error('Empty response from target server');
            res.status(500)
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500)
    } finally {
       if (client) {
            client.close();
        }
    }
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



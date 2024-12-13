// Импортируем необходимые модули
const express = require('express');
// const https = require('https');
const cors = require('cors');
const logger = require('morgan');
const {getStatus} = require("./controllers")

const app = express();
const PORT = 10000; // Порт для middleware сервера
// const agent = new https.Agent({  
//     rejectUnauthorized: false // Отключение проверки SSL-сертификатов
// });
// Middleware для обработки JSON-запросов
const formatsLogger =  'dev' 
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());


const router = express.Router();



function tryCatchWrapper(Fn) {
    return async (req, res, next) => {
      try {
        await Fn(req, res, next);
      } catch (error) {
        return next(error);
      }
    };
  }

  router.get('/status', tryCatchWrapper(getStatus));

// Роут для перенаправления запросов
// app.all('/status', async (req, res) => {
//     try {
//         // Формируем параметры для запроса
//         const targetUrl = `https://api.nopcha.com${"/status?key=I-PG88N6RRYKUY"}`; // Перенаправление на тот же путь
//         // console.log(req.originalUrl)
//         const options = {
//             method: req.method,
//             url: targetUrl,
//             // headers: {
//             //     ...req.headers,
//             //     host: 'api.nopcha.com', // Убедитесь, что заголовок host корректен
//             // },
//             // data: req.body,
//             // httpsAgent: agent, // Используем кастомный агент
//         };

//         // Отправляем запрос через Axios
//         const response = await axios(options);
// console.log(response.data)
//         // Отправляем ответ клиенту
//         res.status(200).json({msg:"done"})
//     } catch (error) {
//         // Обработка ошибок
//         if (error.response) {
//             res.status(error.response.status).send(error.response.data);
//         } else {
//             res.status(500).send({ message: 'Internal Server Error', error: error.message });
//         }
//     }
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
  
    if (err.message.includes('duplicate key error collection')) {
      return res.status(409).json({
        message: err.message,
      });
    }
  
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error' });
  });

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Middleware сервер запущен на ${PORT}`);
});
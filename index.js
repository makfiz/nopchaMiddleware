// Импортируем необходимые модули
const express = require('express');
const axios = require('axios');
const https = require('https');



const app = express();
const PORT = 3000; // Порт для middleware сервера
const agent = new https.Agent({  
    rejectUnauthorized: false // Отключение проверки SSL-сертификатов
});
// Middleware для обработки JSON-запросов
app.use(express.json());

// Роут для перенаправления запросов
app.all('*', async (req, res) => {
    try {
        // Формируем параметры для запроса
        const targetUrl = `https://api.nopcha.com${req.originalUrl}`; // Перенаправление на тот же путь
        // console.log(req.originalUrl)
        const options = {
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                host: 'api.nopcha.com', // Убедитесь, что заголовок host корректен
            },
            data: req.body,
            // httpsAgent: agent, // Используем кастомный агент
        };

        // Отправляем запрос через Axios
        const response = await axios(options);
// console.log(response)
        // Отправляем ответ клиенту
        res.status(response.status).send(response.data);
    } catch (error) {
        // Обработка ошибок
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send({ message: 'Internal Server Error', error: error.message });
        }
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Middleware сервер запущен на ${PORT}`);
});
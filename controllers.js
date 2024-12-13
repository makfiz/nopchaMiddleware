const axios = require('axios');
async function getStatus(req, res, next) {
    const targetUrl = `https://api.nopcha.com/status?key=I-PG88N6RRYKUY`; // Перенаправление на тот же путь
    // console.log(req.originalUrl)
    const options = {
        method: req.method,
        url: targetUrl,
        // headers: {
        //     ...req.headers,
        //     host: 'api.nopcha.com', // Убедитесь, что заголовок host корректен
        // },
        // data: req.body,
        // httpsAgent: agent, // Используем кастомный агент
    };

    // Отправляем запрос через Axios
    const response = await axios(options);
console.log(response.data)
    // Отправляем ответ клиенту
   return res.status(200).json({msg:"done"})
}


module.exports = {
    getStatus
  };
  
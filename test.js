const axios = require('axios');


const url = 'https://api.nopecha.com/status?key=I-PG88N6RRYKUY';
// const url = 'http://localhost:3000/status?key=I-PG88N6RRYKUY';

(async function test() {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.error({
            message: error.message,
            status: error.response?.status,
            headers: error.response?.headers,
            data: error.response?.data,
        }); // Логируем подробности ошибки
    }
})();

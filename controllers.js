// const axios = require('axios');
async function getStatus(req, res, next) {
    const targetUrl = `https://api.nopcha.com/status?key=I-PG88N6RRYKUY`; // Target API URL

    
        const options = {
            method: "GET",
        };
    
        // Send the request using fetch
        const response = await fetch(targetUrl, options);
    
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            
        }
    
        const data = await response.json();
        console.log(data);
    
        // Return the response to the client
        // return res.status(200).json(data);
    // Отправляем ответ клиенту
   return res.status(200).json({msg:"done"})
}


module.exports = {
    getStatus
  };
  
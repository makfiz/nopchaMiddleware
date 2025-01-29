const http = require("http");
const httpProxy = require("http-proxy");

// Создаем прокси-сервер
const proxy = httpProxy.createProxyServer({});

// Настраиваем сервер
const server = http.createServer((req, res) => {
  // Проверяем, что запрос предназначен для `api.nopcha.com`
  if (req.headers.host === "api.nopcha.com") {
    // Перенаправляем запрос на оригинальный API
    proxy.web(req, res, { target: "https://api.nopcha.com", changeOrigin: true }, (err) => {
      console.error("Ошибка при проксировании:", err);
      res.writeHead(502);
      res.end("Ошибка прокси-сервера");
    });
  } else {
    // Если запрос не к api.nopcha.com, возвращаем ошибку
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Доступ запрещен");
  }
});

// Слушаем порт 8080
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Прокси-сервер запущен на http://localhost:${PORT}`);
});

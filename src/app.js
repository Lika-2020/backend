const http = require('http');
const { URL } = require('url');
const fs = require('fs').promises;
const path = require('path');

const hostname = '127.0.0.1';
const port = 3003;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const query = url.searchParams;
  
  if (url.pathname === '/users' && req.method === 'GET') {
    // Ответ на запрос ?users
    const filePath = path.join(__dirname, './data/users.json');
    try {
      const data = await fs.readFile(filePath, 'utf8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end();
    }
  } else if (query.has('hello')) {
    const name = query.get('hello');
    if (name.trim() === '') {
      // Ответ на запрос с пустым значением
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Enter a name');
    } else {
      // Ответ на запрос с параметром name
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Hello, ${name}!`);
    }
  } else if (url.pathname === '/') {
    // Ответ на запрос без параметров
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!');
  } else {
    // Ответ на запросы, не соответствующие формату
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен по адресу http://${hostname}:${port}/`);
});

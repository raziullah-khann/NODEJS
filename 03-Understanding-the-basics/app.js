const http = require('http');    
const routes = require('./routes');

console.log(routes.someText);
// createServer method return a server
const server = http.createServer(routes.handler); 

server.listen(3000);
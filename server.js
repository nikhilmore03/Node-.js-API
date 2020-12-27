const http=require('http');
const app=require('./app');
//Main file where server is listening on port
const port=process.env.PORT ||3000;

const server=http.createServer(app);

server.listen(port);
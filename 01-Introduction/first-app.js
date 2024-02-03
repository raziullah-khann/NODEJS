// console.log('Hello from Node.js');
const fs = require('fs');
// console.log('filesystem',fs); //it return an object
fs.writeFileSync('hello.txt', 'Hello from Node.js');
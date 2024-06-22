const fs = require('fs'); 

const requestHandler = (req, res) => {
    // Here, the server routes requests based on the requested URL and HTTP method.
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    
    //Resirecting Request
    // Location: Used in redirection to indicate the URL to which the client should be redirected.
    if(url === '/message' && method === 'POST') {
        const body = [];
        req.on("data", (chunk) => { //on allows us to certain events data event fired whenever new chunk ready to be read. callback function execute for every incoming data piece.
            console.log(chunk)
            body.push(chunk); 
        });

        return req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message =  parseBody.split('=')[1];
            fs.writeFile('message.txt', message, (error) => {
                // console.log(parseBody); 
                res.statusCode=302;
                res.setHeader('Location', '/');
                return res.end();
            }); 
        })
    }
    
    // Content-Type: Specifies the media type of the resource (e.g., text/html, application/json).
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();

};

// module.exports=requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some hard code text'
// }

// module.exports.handler=requestHandler;
// module.exports.someText='Some hard code text';

exports.handler=requestHandler;
exports.someText='Some hard code text!';
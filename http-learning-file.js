const http = require('http');

const todos = [
    {id: 1, name: "First", address: "Grw" },
    {id: 2, name: "Second", address: "Lhr" },
    {id: 3, name: "Third", address: "Lhr" },
    {id: 4, name: "Fourth", address: "Grw" }
]

const server = http.createServer((req, res) => {
    let body = [];
    const {method, url} = req;

    req.on('data', chunk => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        let status = 404;
        const response = {
            success: false,
            data: null,
            error: ''
        }

    if(method === 'GET' && url === '/todos'){
        status = 200;
        response.success = true;
        response.data = todos
    }
    else if(method === 'POST' && url === '/todos'){
        const {id, name, address} = JSON.parse(body);
        
        if(!id || !name){
            status = 400;
            response.error = "Please add id and name"
        }
        else {
            todos.push({id, name, address});
            status = 201;
            response.success = true;
            response.data = todos
        }
    }
        res.writeHead(status, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js'
        });

        res.end(
            JSON.stringify(response)
        );
    });
});

PORT = 5000;

server.listen(PORT, () => console.log(`Server is running on post ${PORT}`))
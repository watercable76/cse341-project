const fs = require('fs');

const users = ['Susan B', 'Harold Cunningham', 'Larry Joe', 'New Guy'];

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        // standard page
        res.write(`<html>
            <head><title>Enter Message</title></head>
            <body>
                <form action="/create-user" method="POST"><input type="text" name="username" placeholder="Username">
                    <button type="submit">Send</button></input></form>
            </body>
            </html>`);
        return res.end();
    }

    if (url === '/users') {
        // page of users information
        var people = "";

        for (let i = 0; i < users.length; i++) {
            people += '<li>' + users[i] + '</li>';
        }

        res.write(`<html>
        <head><title>Users</title></head>
        <body>
            <ul> ${people} </ul>
        </body>
        </html>`);
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const data = [];
        req.on('data', (userInput) => {
            data.push(userInput);
        });

        return req.on('end', (err) => {
            const parsedData = Buffer.concat(data).toString();
            const newUser = "\n" + parsedData.split('=')[1];
            users.push(newUser);
            fs.appendFile('newUsers.txt', newUser, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/users');
                return res.end();
            });
        });
    }

};

module.exports = requestHandler;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
const users = {};
io.on('connection', (socket) => {
    console.log('connection established');
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('send', (message) => {
        io.sockets.emit('receive', { message: message, name: users[socket.id] });
    })

    socket.on('disconnect', () => {
        console.log('disconnect connection');
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    })
})

server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})



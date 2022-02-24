const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
const users = {};
io.on('connection', (socket) => {
    console.log('connection established');
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        console.log(users);
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('send', (message) => {
        io.sockets.emit('receive', { message: message, name: users[socket.id] });
    })

    socket.on('disconnect', () => {
        console.log('disconnect connection');
    })
})

server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})



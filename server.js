const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { spawn } = require('child_process');
const os = require('os');
const shellCommand = os.platform() === 'win32' ? 'powershell' : '/bin/bash';

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
    const shell = spawn(shellCommand);

    shell.stdout.on('data', function(data) {
        socket.emit('stdout', data.toString());
    });

    shell.stderr.on('data', function(data) {
        socket.emit('stderr', data.toString());
    });

    socket.on('stdin', function(data) {
        if (data === '\x03') {
            shell.kill('SIGINT');
            shell.stdin.write('\n');
        } else {
            shell.stdin.write(data);
        }
    });
});

server.listen(3000, ()=>{
    console.log('listening on http://localhost:3000');
});
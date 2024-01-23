const socket = io.connect();
const term = new Terminal();

term.open(document.getElementById('terminal'));

term.onData(data => socket.emit('stdin', data));

socket.on('stdout', function(data) {
    term.write(data);
});

socket.on('stderr', function(data) {
    term.write(data);
});
'use strict';
var msgs=[];
module.exports = function(socketio) {
    var chat = socketio.of('/chat');
    chat.on('connection', function(socket) {
        console.log("a connnect",socket.id);
        socket.on('chat', function(message) {
            console.log("receive:", message);
            chat.emit('chat', message);
        });
        socket.on("disconnect",function(){
            console.log("disconnect");
            chat.emit("offline");
        })
    });
}

const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,userLeave,getCurrentUser,getRoomUsers} = require('./utils/users');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const botName = "WeChat Bot";

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on("connection", socket => {
    //console.log('New connection...');

    socket.on('joinRoom', ({username,room}) => {

        const user=userJoin(socket.id,username,room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome '+user.username+'!'));//only to the user who joined this server

        socket.broadcast.to(user.room).emit('message', formatMessage(botName, ""+user.username+" has joined the room"));//to all except the new user
        
        //send user and room info for sidebar
        io.to(user.room).emit('roomUsers', {room: user.room,users: getRoomUsers(user.room)});
    });

   
    //messages
    socket.on('chatMessage',(msg) => {
        //console.log(msg);
        const user=getCurrentUser(socket.id);
        io.emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', ()=>{
        const user=userLeave(socket.id);
        if(user)
        {
            io.to(user.room).emit('message', formatMessage(botName, user.username+' has left the room'));
        }

        //send user and room info for sidebar
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });//to all

});

const PORT = process.env.PORT||3000;
server.listen(PORT, ()=> console.log('Server running on port '+PORT));


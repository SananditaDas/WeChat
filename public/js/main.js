const socket = io();
const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages');

const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});

//join room
socket.emit('joinRoom', {username, room});

// message from server
socket.on('message', message =>{
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop=chatMessages.scrollHeight;
});

//update the room and room users
socket.on('roomUsers', ({room,users}) => {
  outputRoom(room);
  outputUsers(users);
});

//message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;
  //console.log(msg);
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value='';
  e.target.elements.msg.focus();
});

document.getElementById('leave-btn').addEventListener('click', () => {
  window.location = '../index.html';
});

function outputMessage(message)
{
  const div=document.createElement('div');
  div.classList.add('message');
  div.innerHTML = "<p class='meta'>"+message.username+" <span>"+message.time+"</span></p><p class='text'>"+message.text+"</p>";
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoom(roomName)
{
  const room = document.getElementById('room-name');
  room.innerHTML=roomName;
}

function outputUsers(users)
{
  const userList = document.getElementById('users');
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
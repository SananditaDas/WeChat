const socket = io();
const chatForm = document.getElementById('chat-form');
const msgArea = document.getElementById('msg');
const userRegion=document.getElementById('user-region');
const chatMessages = document.querySelector('.chat-messages');

const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});

//join room
socket.emit('joinRoom', {username, room});

// message from server
socket.on('message', message =>{
  
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop=chatMessages.scrollHeight;
});

//update the room and room users
socket.on('roomUsers', ({room,users}) => {
  outputRoom(room);
  outputUsers(users);
  userRegion.scrollTop=userRegion.scrollHeight;
});


socket.on('typing-disp', user => {
  outputUserTyping(user);
});


//typing...
msgArea.addEventListener('keypress', e => {
  
  if(e.key!=="Enter")
  {
    socket.emit('typing',socket.id);
  }
});

//message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;
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
    li.setAttribute("id", user.id);
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

function outputUserTyping(user)
{
  const userTyping = document.getElementById(user.id);
  userTyping.innerText=user.username+" is typing...";
  setTimeout(()=>{
    userTyping.innerText=user.username;
  },1000);
  
}
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import '../styles/Whiteboard.css';


const socket = io('http://localhost:5000');

const Whiteboard = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState(1);
  const [tool, setTool] = useState({ type: 'pen', color: 'black', width: 2 });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
  const username = localStorage.getItem('username') || 'Anonymous';
  socket.emit('join-room', { roomId, username });

  // You joined
  socket.on('welcome-user', (name) => {
    setNotification(`You joined the room as ${name}`);
    setTimeout(() => setNotification(null), 3000);
  });

  // Someone else joined
  socket.on('user-joined', ({ name }) => {
    setNotification(`${name} joined the room`);
    setTimeout(() => setNotification(null), 3000);
  });

  socket.on('user-count', setUsers);

  return () => {
    socket.emit('leave-room', roomId);
    socket.off();
  };
}, [roomId]);

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <h3>Room-ID: {roomId} | Users: {users}</h3>
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div>
      <Toolbar tool={tool} setTool={setTool} socket={socket} />
      <DrawingCanvas roomId={roomId} socket={socket} tool={tool} />
      <UserCursors socket={socket} />
    </div>
  );
};

export default Whiteboard;
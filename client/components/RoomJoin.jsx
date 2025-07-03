import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoomJoin.css'; // Ensure you have this CSS file for styling


 function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const RoomJoin = () => {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

     useEffect(() => {
    setRoomCode(generateRoomCode(8)); // or 6-8 chars
  }, []);

  const handleJoin = async () => {
    if (roomCode.trim() && name.trim()) {
      // Save name to localStorage
      localStorage.setItem('username', name);

      // Optionally call backend API
      await fetch('http://localhost:5000/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomCode.trim(), name }),
      });

      navigate(`/room/${roomCode.trim()}`);
    }
  };

  return (
    <div className="room-join-container">
  <div className="room-join-box">
    <h1>Real-Time Whiteboard</h1>

    <h2>Enter your name:</h2>
    <input
      type="text"
      value={name}
      placeholder="Your name"
      onChange={(e) => setName(e.target.value)}
    />

    <h2>Enter Room Code:</h2>
    <input
      type="text"
      value={roomCode}
      placeholder="Room code"
      onChange={(e) => setRoomCode(e.target.value)}
    />

    <button onClick={handleJoin}>Join Room</button>
  </div>
</div>

  );
};

export default RoomJoin;

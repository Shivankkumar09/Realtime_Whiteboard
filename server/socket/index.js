// server/socket/index.js
const Room = require('../models/Room');

const roomUsers = {}; // { roomId: Set(socket.id) }
const cursorPositions = {}; // { socket.id: { x, y } }
const COLORS = ['#f44336', '#e91e63', '#9c27b0', '#000000FF' ,'#03a9f4',  '#4caf50'];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
const userColors = {};


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

      socket.on('welcome-user', (name) => {
    setNotification(`You joined the room as ${name}`);
    setTimeout(() => setNotification(null), 3000);
  });

  socket.on('join-room', async ({ roomId, username }) => {
  socket.join(roomId);

  // Assign random color and save username
  userColors[socket.id] = getRandomColor();
  socket.username = username;

  // Track room users
  if (!roomUsers[roomId]) {
    roomUsers[roomId] = new Set();
  }
  roomUsers[roomId].add(socket.id);

  // 👇 Notify only others that someone joined
  socket.to(roomId).emit('user-joined', { name: username });

  // 👇 Notify the current user
  socket.emit('welcome-user', username);

  // 👇 Update user count
  io.to(roomId).emit('user-count', roomUsers[roomId].size);

  // 👇 Send cursor color to others
  socket.to(roomId).emit('cursor-update', {
    id: socket.id,
    x: 0,
    y: 0,
    color: userColors[socket.id],
  });
});


    socket.on('cursor-move', ({ x, y }) => {
       const color = userColors[socket.id];
      cursorPositions[socket.id] = { x, y };
      for (const [roomId, users] of Object.entries(roomUsers)) {
        if (users.has(socket.id)) {
          socket.to(roomId).emit('cursor-update', { id: socket.id, x, y, color });
        }
      }
    });

    socket.on('draw-path', async ({ roomId, path, color, width }) => {
      socket.to(roomId).emit('draw-path', { path, color, width });
      // Optionally, save to DB
      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: {
            drawingData: {
              type: 'stroke',
              data: { path, color, width },
              timestamp: new Date(),
            },
          },
          $set: { lastActivity: new Date() },
        }
      );
    });

    socket.on('draw-end', async ({ path, color, width, roomId }) => {
  // Save full stroke to DB
  const room = await Room.findOne({ roomId });
  if (room) {
    room.drawingData.push({
      type: 'stroke',
      data: { path, color, width },
      timestamp: new Date(),
    });
    room.lastActivity = new Date();
    await room.save();
  }
});

    socket.on('clear-canvas', async () => {
      for (const [roomId, users] of Object.entries(roomUsers)) {
        if (users.has(socket.id)) {
          io.to(roomId).emit('clear-canvas');
          await Room.findOneAndUpdate(
            { roomId },
            {
              $push: {
                drawingData: {
                  type: 'clear',
                  data: {},
                  timestamp: new Date(),
                },
              },
              $set: { lastActivity: new Date() },
            }
          );
        }
      }
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      if (roomUsers[roomId]) {
        roomUsers[roomId].delete(socket.id);
        if (roomUsers[roomId].size === 0) delete roomUsers[roomId];
        io.to(roomId).emit('user-count', roomUsers[roomId]?.size || 0);
      }
      socket.broadcast.emit('cursor-remove', socket.id);
    });

    socket.on('disconnect', () => {
      for (const [roomId, users] of Object.entries(roomUsers)) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          io.to(roomId).emit('user-count', users.size);
        }
      }
      delete cursorPositions[socket.id];
      socket.broadcast.emit('cursor-remove', socket.id);
      
    });
  });
};


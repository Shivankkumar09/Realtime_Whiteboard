const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.post("/join", async (req, res) => {
  const { roomId, name } = req.body;

  let room = await Room.findOne({ roomId });

  if (!room) {
    room = new Room({
      roomId,
      lastActivity: new Date(),
      participants: [{ name }],
    });
  } else {
    room.participants.push({ name });
    room.lastActivity = new Date();
  }

  await room.save();
  res.json(room);
});


router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ drawingData: room.drawingData });
});

module.exports = router;

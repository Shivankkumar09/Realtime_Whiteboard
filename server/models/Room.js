const mongoose = require("mongoose");

const DrawingCommandSchema = new mongoose.Schema({
  type: String,
  data: Object,
  timestamp: Date,
});

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: Date,
  drawingData: [DrawingCommandSchema],
  participants: [{ name: String }],
});

module.exports = mongoose.model("Room", RoomSchema);

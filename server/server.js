const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const roomRoutes = require("./routes/room");
const initSocket = require("./socket");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/rooms", roomRoutes);

initSocket(io);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

server.listen(PORT, () => console.log(`Server running on port ${PORT} & connected to database`));

# 🧠 Real-time Collaborative Whiteboard

A full-stack real-time collaborative whiteboard built using the **MERN stack** and **Socket.io**. Users can join a shared room, draw together in real time, and see each other's cursors and brush updates. Built with performance and responsiveness in mind, including throttled event handling, canvas path syncing, and cursor tracking.

## 🚀 Features
- 🎨 **Drawing Canvas** with color, brush size, and eraser
- 🔗 **Room-based sharing** (via room ID)
- 🧑‍🤝‍🧑 **Real-time collaboration** using Socket.io
- 📍 **Live cursor tracking** with unique colors
- 🧹 **Clear canvas** across all clients
- 💾 **Persistent drawing data** (MongoDB)
- ⚡ **Throttled draw & cursor sync** for better performance (~60fps)
- 📱 **Responsive floating toolbar**, collapsible on tablet/mobile
- 💤 **Cursor hides on inactivity**
- 🧽 **Room cleanup** for inactivity after 24+ hours (server-side ready)

## 🧰 Tech Stack
- **Frontend:** React, CSS, `lodash.throttle`, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB (via Mongoose)
- **Extras:** Canvas API, UUID, REST APIs, localStorage

## 📂 Folder Structure
```
client/
  ├── src/
  │   ├── components/
  │   │   ├── DrawingCanvas.js
  │   │   ├── Toolbar.js
  │   │   ├── UserCursors.js
  │   │   └── Whiteboard.js
  │   ├── styles/
  │   └── App.jsx
server/
  ├── models/
  │   └── Room.js
  ├── routes/
  │   └── roomRoutes.js
  ├── socket/
  │   └── index.js
  └── server.js
  ├── README.md
  └── package.json            # Root-level monorepo control
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js >= 14
- MongoDB running locally or on Atlas

### 1. Clone the repository
```bash
git clone https://github.com/your-username/whiteboard-app.git
cd whiteboard-app
```

### 2. Install client dependencies
```bash
cd client
npm install
```

### 3. Install server dependencies
```bash
cd ../server
npm install
```

### 4. Setup environment
Create a `.env` file in `/server`:
```
PORT=5000
MONGO_URI=your mongodb connection string/ URL
```

### 5. Run the app
Open two terminals:

**Start backend:**
```bash
cd server
npm start
```

**Start frontend:**
```bash
cd client
npm start
```

App will be available at `http://localhost:3000`

---

## 🧠 Architecture Overview

```
Client (React)
│
├── DrawingCanvas.jsx        --> Captures mouse/touch and emits paths
├── Toolbar.jsx              --> Tool controls (brush, eraser, clear)
├── UserCursors.jsx          --> Renders other user cursors
│
└── Socket.io (WebSocket)
        │
        ▼
Server (Node.js + Express + Socket.io)
├── socket/index.js          --> Handles draw events, room join/leave, cursors
├── models/Room.js           --> Mongoose schema for storing drawing data
└── routes/room.js           --> REST API to fetch room data on join
```

---

## 🌐 API + Socket Documentation

### 🧩 Socket Events

#### Client → Server
| Event            | Payload                                  | Description                       |
|------------------|-------------------------------------------|-----------------------------------|
| `join-room`      | `{ roomId, username }`                   | Join or create a room             |
| `draw-path`      | `{ roomId, path, color, width }`         | Send live path segment            |
| `draw-end`       | `{ roomId, path, color, width }`         | Save complete stroke to DB        |
| `clear-canvas`   | –                                        | Clear canvas and notify others    |
| `cursor-move`    | `{ x, y }`                               | Send current cursor position      |
| `leave-room`     | `roomId`                                 | Leave room and cleanup            |

#### Server → Client
| Event            | Payload                                  | Description                       |
|------------------|-------------------------------------------|-----------------------------------|
| `draw-path`      | `{ path, color, width }`                 | Draw path from other user         |
| `clear-canvas`   | –                                        | Clear canvas                      |
| `cursor-update`  | `{ id, x, y, color }`                    | Update user cursor                |
| `cursor-remove`  | `socketId`                               | Remove disconnected user's cursor |
| `user-count`     | `number`                                 | Update connected user count       |
| `user-joined`    | `{ name }`                               | Show notification when user joins |
| `welcome-user`   | `name`                                   | Show "you joined" message         |

---

### 🛠️ REST API

#### `GET /api/rooms/:roomId`

Returns all previous drawing history (strokes + clears) from MongoDB for a room.

**Response:**
```json
{
  "drawingData": [
    {
      "type": "stroke",
      "data": {
        "path": [ { "x": 120, "y": 250 }, ... ],
        "color": "#000000",
        "width": 4
      },
      "timestamp": "2025-07-03T10:15:00Z"
    }
  ]
}
```

#### `POST /api/rooms/join`

Add a user to the room (stores name, time)

**Body**
```json
{
  "roomId": "A1B2C3",
  "name": "Shivank"
}
```

**Response:**
```json
{
  "_id": "60...",
  "roomId": "A1B2C3",
  "lastActivity": "2025-07-03T17:00:00.000Z",
  "participants": [
    { "name": "Shivank" }
  ],
  ...
}
```

---

## 🚀 Deployment Guide

### 1. Build frontend
```bash
cd client
npm run build
```

### 2. Serve React from Express (optional)
Move `client/build` to `server/public` and in `server/index.js`:

```js
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### 3. Use PM2 to run server in production
```bash
npm install -g pm2
pm2 start server/index.js --name whiteboard-server
```

### 4. MongoDB Atlas (optional)
Use your MongoDB Atlas connection string in `.env` file.

---

## 🙌 Acknowledgments

- Socket.io docs
- MongoDB official driver

## 💡 Future Enhancements
- Undo/redo functionality
- Shape tools (rectangle, line, circle)
- Export canvas as image
- User authentication & room permissions
- Invite links and room management

## 🙌 Author
Built with ❤️ by **Shivank Kumar**  
For educational purposes & real-time systems demo

---

> **Note:** Drawing sync is optimized with throttling (~60fps) and only sends minimal path segments. Lag may occasionally appear due to network conditions or device performance but has been minimized as much as possible.

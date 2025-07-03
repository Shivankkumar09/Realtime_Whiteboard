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
```

## 🧪 Getting Started Locally

### 1. Clone the repo:
```bash
git clone https://github.com/yourusername/realtime-whiteboard.git
cd realtime-whiteboard
```

### 2. Start the backend:
```bash
cd server
npm install
npm run dev
```

### 3. Start the frontend:
```bash
cd client
npm install
npm run dev
```

## ⚙️ Environment Variables
Create a `.env` file in the `/server` directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## 📸 Screenshots

| Drawing | Cursor Sync |
|--------|-------------|
| ![Draw](https://via.placeholder.com/400x200) | ![Cursor](https://via.placeholder.com/400x200) |

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

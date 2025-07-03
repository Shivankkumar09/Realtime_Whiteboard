// client/src/components/UserCursors.js
import React, { useEffect, useState } from 'react';
import '../styles/UserCursors.css'; // 👈 create this file

const UserCursors = ({ socket }) => {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
   socket.on('cursor-update', ({ id, x, y, color }) => {
  setCursors((prev) => ({
    ...prev,
    [id]: { x, y, color },
  }));
});

    socket.on('cursor-remove', (id) => {
      setCursors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    const handleMouseMove = (e) => {
      socket.emit('cursor-move', { x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.off('cursor-update');
      socket.off('cursor-remove');
    };
  }, []);

  return (
    <>
    {Object.entries(cursors).map(([id, { x, y, color }]) => (
  <div
    key={id}
    className="cursor-follower"
    style={{ left: x + 'px', top: y + 'px' }}
  >
    <div
      className="pointer"
      style={{ backgroundColor: color || 'red' }}
    />
  </div>
))}
    </>
  );
};

export default UserCursors;


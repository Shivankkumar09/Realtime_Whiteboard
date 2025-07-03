import { useEffect, useRef } from 'react';
import throttle from 'lodash.throttle';

const DrawingCanvas = ({ roomId, socket, tool }) => {
  const canvasRef = useRef();
  const isDrawing = useRef(false);
  const pathRef = useRef([]);
  const ctx = useRef();
  const drawBuffer = useRef([]);

  // 🔧 Keep latest tool values to use inside throttled function
  const currentTool = useRef(tool);
  useEffect(() => {
    currentTool.current = tool;
  }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.current = canvas.getContext('2d');

    socket.on('draw-path', ({ path, color, width }) => {
      drawPath(path, color, width);
    });

    const handleClearCanvas = () => {
      ctx.current.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on('clear-canvas', handleClearCanvas);

    fetch(`http://localhost:5000/api/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.drawingData) {
          data.drawingData.forEach((cmd) => {
            if (cmd.type === 'stroke') {
              drawPath(cmd.data.path, cmd.data.color, cmd.data.width);
            } else if (cmd.type === 'clear') {
              ctx.current.clearRect(0, 0, canvas.width, canvas.height);
            }
          });
        }
      });

    return () => {
      socket.off('draw-path');
      socket.off('clear-canvas', handleClearCanvas);
    };
  }, [roomId, socket]);

  const drawPath = (path, color, width) => {
    if (!ctx.current || !path || path.length < 1) return;
    ctx.current.strokeStyle = color;
    ctx.current.lineWidth = width;
    ctx.current.lineJoin = 'round';
    ctx.current.lineCap = 'round';

    ctx.current.beginPath();
    ctx.current.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.current.lineTo(path[i].x, path[i].y);
    }
    ctx.current.stroke();
  };

 const emitDrawThrottled = useRef(
  throttle(() => {
    const buffer = drawBuffer.current;
    if (buffer.length < 2) return;

    socket.emit('draw-path', {
      path: [...buffer],
      color: currentTool.current.color,
      width: currentTool.current.width,
      roomId,
    });

    // Keep last point for continuity
    drawBuffer.current = [buffer.at(-1)];
  }, 16) // ~60fps
).current;

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    pathRef.current = [{ x: e.clientX, y: e.clientY }];
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const point = { x: e.clientX, y: e.clientY };
    const last = pathRef.current.at(-1);
    pathRef.current.push(point);
    drawBuffer.current.push(point);

    drawPath([last, point], currentTool.current.color, currentTool.current.width);
    emitDrawThrottled();
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    socket.emit('draw-end', {
      path: pathRef.current,
      color: currentTool.current.color,
      width: currentTool.current.width,
      roomId,
    });

    pathRef.current = [];
    drawBuffer.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  );
};

export default DrawingCanvas;

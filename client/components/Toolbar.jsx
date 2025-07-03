import { useEffect, useRef, useState } from 'react';
import '../styles/Toolbar.css'; // Assuming you have a CSS file for styling


const colors = ['black', 'red', 'blue', 'green', 'orange', '#ff00ff', '#00ffff'];

const Toolbar = ({ tool, setTool, socket }) => {
  const toolbarRef = useRef();
  const [pos, setPos] = useState({ x: 10, y: 10 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPos({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const startDrag = (e) => {
    setDragging(true);
    const rect = toolbarRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleColorClick = (color) => {
    setTool({ ...tool, color, mode: 'pen' });
  };

  const handleWidthChange = (e) => {
    setTool({ ...tool, width: parseInt(e.target.value) });
  };

  
  const handleClear = () => {
    socket.emit('clear-canvas');
  };

  const handleEraser = () => {
    setTool({ ...tool, color: '#f9fafb', mode: 'eraser' });
  };

  return (
    <div
      ref={toolbarRef}
      className="toolbar draggable"
      style={{ top: pos.y, left: pos.x, position: 'absolute' }}
    >
      <div className="toolbar-header" onMouseDown={startDrag}>
        🎨 Drag Toolbar
      </div>

      <div className="colors">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-button ${tool.color === color && tool.mode === 'pen' ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          />
        ))}

        <button
          className={`eraser-button ${tool.mode === 'eraser' ? 'active' : ''}`}
          onClick={handleEraser}
        >
          <img src="/eraser.png" id="eraser-icon" alt="Eraser" />
        </button>
      </div>

      <div className="slider-group">
        <label>Size: {tool.width}</label>
        <input
          type="range"
          min="1"
          max="50"
          value={tool.width}
          onChange={handleWidthChange}
        />
      </div>

      <button className="clear-btn" onClick={handleClear}>
        Clear Canvas
      </button>
    </div>
  );
};

export default Toolbar;

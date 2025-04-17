window.onload = () => {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const brushColor = document.getElementById('brushColor');
    const brushSize = document.getElementById('brushSize');
    const brushOpacity = document.getElementById('brushOpacity');
    const canvasColor = document.getElementById('canvasColor');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
  
    // eraser toggle button
    const eraserBtn = document.createElement("button");
    eraserBtn.id = "eraserBtn";
    eraserBtn.textContent = "Eraser";
    document.querySelector(".toolbar").appendChild(eraserBtn);
  
    let painting = false;
    let erasing = false;
  
    ctx.fillStyle = canvasColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // The below event listeners allows control over when the mouse is drawing
    canvas.addEventListener('mousedown', (e) => {
      painting = true;
      ctx.beginPath(); // Start fresh path on mousedown
      ctx.moveTo(e.clientX, e.clientY);
    });
  
    canvas.addEventListener('mouseup', () => {
      painting = false;
      ctx.beginPath(); // Reset path
    });
  
    canvas.addEventListener('mouseout', () => {
      painting = false;
      ctx.beginPath();
    });
  
    canvas.addEventListener('mousemove', draw);
  
    // I added more below to support touch from mobile devices

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Stop screen from scrolling
      painting = true;
      const touch = e.touches[0];
      ctx.beginPath();
      ctx.moveTo(touch.clientX, touch.clientY);
    }, { passive: false });
    
    canvas.addEventListener('touchend', () => {
      painting = false;
      ctx.beginPath();
    });
    
    canvas.addEventListener('touchcancel', () => {
      painting = false;
      ctx.beginPath();
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!painting) return;
      const touch = e.touches[0];
      drawTouch(touch.clientX, touch.clientY);
    }, { passive: false });
    
    function draw(e) {
      if (!painting) return;
  
      ctx.lineWidth = brushSize.value;
      ctx.lineCap = 'round';
  
      if (erasing) {
        ctx.strokeStyle = canvasColor.value;
      } else {
        ctx.strokeStyle = hexToRGBA(brushColor.value, brushOpacity.value);
      }
  
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.beginPath(); // Prevent connecting lines between strokes
      ctx.moveTo(e.clientX, e.clientY);
    }
    
    function drawTouch(x, y) {
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = brushColor;
    
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  
    function hexToRGBA(hex, opacity) {
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${opacity})`;
    }
  
    clearBtn.addEventListener('click', () => {
      ctx.fillStyle = canvasColor.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  
    saveBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'painting.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  
    canvasColor.addEventListener('input', () => {
      ctx.fillStyle = canvasColor.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  
    eraserBtn.addEventListener('click', () => {
      erasing = !erasing;
      eraserBtn.textContent = erasing ? "Brush" : "Eraser";
    });
  };
  
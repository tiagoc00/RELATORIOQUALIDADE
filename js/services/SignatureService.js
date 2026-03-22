export class SignatureService {
  constructor(canvasId, emptyId) {
    this.canvas = document.getElementById(canvasId);
    this.empty = document.getElementById(emptyId);
    this.ctx = this.canvas.getContext('2d');
    this.drawing = false;
    this.hasData = false;
    this.setupEvents();
  }

  init() {
    const wrap = this.canvas.parentElement;
    const w = wrap.clientWidth;
    const h = Math.round(w * 0.38);
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.strokeStyle = '#1A1916';
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.clear();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.empty.style.display = 'flex';
    this.hasData = false;
  }

  load(data) {
    if (!data) return;
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
      this.empty.style.display = 'none';
      this.hasData = true;
    };
    img.src = data;
  }

  getData() {
    return this.hasData ? this.canvas.toDataURL() : null;
  }

  setupEvents() {
    const start = (e) => {
      this.drawing = true;
      this.ctx.beginPath();
      const pos = this.getPos(e);
      this.ctx.moveTo(pos.x, pos.y);
      this.empty.style.display = 'none';
      this.hasData = true;
    };
    const move = (e) => {
      if (!this.drawing) return;
      const pos = this.getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
      e.preventDefault();
    };
    const end = () => { this.drawing = false; };

    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    this.canvas.addEventListener('touchstart', start, { passive: false });
    this.canvas.addEventListener('touchmove', move, { passive: false });
    this.canvas.addEventListener('touchend', end);
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
}

export class Particle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0 || this.x < -10 || this.x > this.w + 10 || this.y < -10 || this.y > this.h + 10) {
      this.reset();
    }
  }

  draw(ctx, color) {
    const fade = Math.min(1, this.life / 30, (this.maxLife - this.life) / 30);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${this.alpha * fade})`;
    ctx.fill();
  }
}

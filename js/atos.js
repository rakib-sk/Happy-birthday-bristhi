const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let rockets = [];
let textPoints = [];
let fontSize;

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fontSize = Math.min(canvas.width / 10, canvas.height / 6);
  generateTextParticles();
}

function generateTextParticles() {
  particles = [];
  textPoints = [];

  const offCanvas = document.createElement('canvas');
  offCanvas.width = canvas.width;
  offCanvas.height = canvas.height;
  const offCtx = offCanvas.getContext('2d');

  const textLines = ["Happy birthday", "\nSanjidha Apu"];
  offCtx.font = `bold ${fontSize}px Arial`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillStyle = "white";

  const lineHeight = fontSize * 1.2;
  const startY = canvas.height/2 - (textLines.length-1)/2 * lineHeight;

  textLines.forEach((line, index) => {
    const y = startY + index*lineHeight;
    offCtx.fillText(line, canvas.width/2, y);
  });

  const imageData = offCtx.getImageData(0,0,canvas.width,canvas.height);
  const spacing = Math.floor(fontSize/15);
  for(let y=0; y<canvas.height; y+=spacing){
    for(let x=0; x<canvas.width; x+=spacing){
      const idx = (y*canvas.width + x)*4;
      if(imageData.data[idx+3] > 128){
        textPoints.push({x,y});
      }
    }
  }
}

// Particle class
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random()*2+1;
    this.speedX = (Math.random()-0.5)*6;
    this.speedY = (Math.random()-0.5)*6;
    this.alpha = 1;
    this.targetX = null;
    this.targetY = null;
  }

  update() {
    if(this.targetX != null && this.targetY != null){
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      this.x += dx*0.05;
      this.y += dy*0.05;
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.02;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function createRocket() {
  const x = Math.random()*canvas.width;
  const y = canvas.height;
  const speedY = -(Math.random()*5+7);
  const baseHeight = canvas.height*(0.2+Math.random()*0.3);
  const explodeHeight = baseHeight + (Math.random()*70-35);
  rockets.push({x, y, speedY, explodeHeight});
}

function explode(x, y){
  for(let i=0;i<50;i++){
    particles.push(new Particle(x, y, `hsl(${Math.random()*360},100%,50%)`));
  }
}

let startTime = Date.now();
const duration = 5000;

function animate(){
  const elapsed = Date.now()-startTime;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  if(elapsed<duration){
    if(Math.random()<0.1) createRocket();

    rockets.forEach((r,i)=>{
      r.y += r.speedY;
      if(r.y<=r.explodeHeight){
        explode(r.x, r.y);
        rockets.splice(i,1);
      } else {
        ctx.beginPath();
        ctx.arc(r.x, r.y,3,0,Math.PI*2);
        ctx.fillStyle='white';
        ctx.fill();
      }
    });

    particles.forEach((p,i)=>{
      p.update();
      p.draw();
      if(p.alpha<=0) particles.splice(i,1);
    });

    requestAnimationFrame(animate);

  } else {
    for(let i=0;i<textPoints.length;i++){
      if(particles[i]){
        particles[i].targetX = textPoints[i].x;
        particles[i].targetY = textPoints[i].y;
      } else {
        particles.push(new Particle(canvas.width/2, canvas.height, `hsl(${Math.random()*360},100%,50%)`));
        particles[particles.length-1].targetX = textPoints[i].x;
        particles[particles.length-1].targetY = textPoints[i].y;
      }
    }

    function textAnimate(){
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      let allArrived=true;
      particles.forEach(p=>{
        p.update();
        p.draw();
        if(p.targetX!=null && (Math.abs(p.x-p.targetX)>0.5 || Math.abs(p.y-p.targetY)>0.5)){
          allArrived=false;
        }
      });
      if(!allArrived){
        requestAnimationFrame(textAnimate);
      }
    }
    textAnimate();
  }
}

window.addEventListener('resize', ()=>{
  setupCanvas();
  startTime = Date.now();
});

setupCanvas();

// Continue button starts fireworks and music
const continueBtn = document.getElementById('continueBtn');
continueBtn.addEventListener('click', ()=>{
  const audio = document.getElementById("fireworks-audio");
  audio.play().catch(err=>console.log("Audio play blocked:", err));
  continueBtn.style.display='none';
  startTime = Date.now();
  animate();
});

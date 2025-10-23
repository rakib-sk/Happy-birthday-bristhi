const flame = document.querySelector(".flame");  
const cutBtn = document.querySelector(".cut-btn");  
const hbContainer = document.querySelector(".hb-container");  
const layers = document.querySelectorAll(".layer");  
const candle = document.querySelector(".candle");  
const bazi = document.querySelector(".bazi");  
const baziMouth = document.querySelector(".bazi-mouth");  
const seeMoreBtn = document.getElementById("seeMoreBtn");  
const bgMusic = document.getElementById("bg-music");  
  
// Flame appears  
setTimeout(()=>{ flame.style.display="block"; },5000);  
setTimeout(()=>{ cutBtn.style.display="block"; },7000);  
  
cutBtn.addEventListener("click", ()=>{  
  document.getElementById("audio").play();  
  
  candle.classList.add("candle-bend");  
  
  setTimeout(()=>{  
    bazi.style.display="block";  
  
    const candleRect = candle.getBoundingClientRect();  
    const bodyRect = document.body.getBoundingClientRect();  
    bazi.style.left = (candleRect.left + candleRect.width/2 - bodyRect.left - bazi.offsetWidth/2) + "px";  
    bazi.style.top = (candleRect.bottom - bodyRect.top - bazi.offsetHeight + 5) + "px";  
  
    const mouthRect = baziMouth.getBoundingClientRect();  
    flame.style.position="absolute";  
    flame.style.left = (mouthRect.left + mouthRect.width/2 - bodyRect.left - flame.offsetWidth/2) + "px";  
    flame.style.top = (mouthRect.top - bodyRect.top - flame.offsetHeight/2) + "px";  
    document.body.appendChild(flame);  
  
    setTimeout(()=>{  
      // Boom fireworks  
      for(let i=0;i<50;i++){  
        const boom = document.createElement("div");  
        boom.className="boom";  
        boom.style.left = Math.random()*window.innerWidth + "px";  
        boom.style.top = Math.random()*window.innerHeight + "px";  
        document.body.appendChild(boom);  
        setTimeout(()=>boom.remove(),1200);  
      }  
  
      flame.remove();  
      bazi.style.display="none";  
      candle.style.display="none";  
  
      for(let i=0;i<200;i++){  
        const conf = document.createElement("div");  
        conf.className="confetti";  
        conf.style.background = `hsl(${Math.random()*360},100%,50%)`;  
        conf.style.left = Math.random()*window.innerWidth + "px";  
        conf.style.top = Math.random()*window.innerHeight + "px";  
        conf.style.width = conf.style.height = (Math.random()*8 + 5) + "px";  
        document.body.appendChild(conf);  
  
        const animX = Math.random()*400 - 200;  
        const animY = Math.random()*400 - 200;  
        conf.animate([  
          {transform:"translate(0,0)", opacity:1},  
          {transform:`translate(${animX}px,${animY}px) rotate(${Math.random()*360}deg)`, opacity:0}  
        ], {duration:2000, fill:"forwards"});  
        setTimeout(()=>conf.remove(),2000);  
      }  
  
      const text = "🎉 Happy Birthday Sanjidha(My dear)";  
      hbContainer.innerHTML="";  
      for(let i=0;i<text.length;i++){  
        const span = document.createElement("span");  
        span.className="hb-letter";  
        span.style.animationDelay = `${i*0.1}s`;  
        span.textContent=text[i];  
        hbContainer.appendChild(span);  
      }  
      hbContainer.style.opacity="1";  
  
      cutBtn.style.display="none";  
  
      document.getElementById("birthday-audio").play();  
  
      // 🔊 fireworks এর পরে background music চালু  
      bgMusic.play();  
  
      setTimeout(()=>{ seeMoreBtn.style.display="block"; }, 4000);  
  
    },2000);  
  
  },1000);  
  
  layers.forEach((layer, i)=>{  
    setTimeout(()=>{ layer.classList.add("fall"); }, i*200);  
  });  
});  
  
seeMoreBtn.addEventListener("click", ()=>{  
  bgMusic.pause();  
});  

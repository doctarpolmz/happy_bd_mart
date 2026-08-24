/* =========================================================================
   ✏️  EDIT ME — CONFIG
   This is the ONLY place you need to change to personalize the surprise.
   Everything below CONFIG is app logic and shouldn't need to change.
   ========================================================================= */
const CONFIG = {

  // The passkey they must type on the lock screen.
  // REPLACE: pick any number, e.g. a birthday, an anniversary, "0000"...
  passkey: "polmz",

  // REPLACE: the little circular photo shown on the lock screen.
  // Put the image file inside the images/ folder and put its filename here.
  hintPhoto: "images/457e3c7cf79cac12efbbf1f525ed948a.jpg",

  // REPLACE: the date your story together began ("YYYY-MM-DD").
  // The counter screen shows how many years / months / days since this date.
  togetherSince: "2000-08-24",

  // REPLACE: headline + subheading on the counter screen.
  counterTitle: "Happy Birthday, My Love",
  counterSubtitle: "You have completed",

  // REPLACE: your photos for the "Special Memories" carousel.
  // Add as many as you like, in order. Put the image files in images/.
  photos: [
    { src: "images/file_0000000077bc82468d7455a3f1c29216.png", caption: "Episode 2 of Chapter 1: Once Upon Us" },
    { src: "images/IMG_20240930_093214_101.jpg", caption: "The secrets we share" },
    { src: "images/IMG_20240930_093301_723.jpg", caption: "The smile since day 1" },
    { src: "images/IMG_20240930_093315_865.jpg", caption: "The confidence" },
    { src: "images/IMG_20240930_093329_066.jpg", caption: "The promises from day 1" },
    { src: "images/IMG_20240930_094150_201.jpg", caption: "The comfort we had around each other" },
    { src: "images/IMG_20250304_122528_698 (1).jpg", caption: "Spoiling each other but we still stand" },
    { src: "images/IMG_20250921_203838_133.jpg", caption: "What others think is AI" },
    { src: "images/download (1).png", caption: "You have always loved me with my family" },
    { src: "images/mart.jpeg", caption: "Now here, still counting years. Love you mine" }
  ],

  // REPLACE: your letter. Leave a blank line to start a new paragraph.
  letter:
`Happy birthday to my beautiful love, Mart!

I'm so proud of the woman you are and honestly, I can't wait to see you become he incredible mother of our children someday. You are not just someone I love, you are woman I see in my future, the one I want beside me hroughit all.
May this new chapter bring you everything your heart deserves. Keep shining, my love.
Happy Birthday, my queen. I love you more than words can explain.

Yours always,
Polmz`,

};

/* =========================================================================
   APP LOGIC — shouldn't need to edit below this line
   ========================================================================= */
(() => {
  "use strict";

  const SCREENS = ["lock", "loading", "counter", "memories", "letter"];
  let currentIndex = 0;

  const screenEls = Object.fromEntries(
    SCREENS.map(name => [name, document.getElementById(`screen-${name}`)])
  );

  /* ---------------- progress dots ---------------- */
  const dotsWrap = document.getElementById("progressDots");
  SCREENS.forEach(() => {
    const d = document.createElement("span");
    dotsWrap.appendChild(d);
  });
  function renderDots(){
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle("on", i === currentIndex));
  }

  function goTo(nameOrIndex){
    const idx = typeof nameOrIndex === "number" ? nameOrIndex : SCREENS.indexOf(nameOrIndex);
    if (idx < 0) return;
    screenEls[SCREENS[currentIndex]].classList.remove("active");
    currentIndex = idx;
    screenEls[SCREENS[currentIndex]].classList.add("active");
    renderDots();
    if (SCREENS[currentIndex] === "loading") runLoadingThenAdvance();
    if (SCREENS[currentIndex] === "counter") animateCounter();
  }

  document.querySelectorAll("[data-next]").forEach(btn => {
    btn.addEventListener("click", () => goTo(currentIndex + 1));
  });

  /* ---------------- Screen 1: lock / keypad ---------------- */
  const hintImg = document.getElementById("hintPhotoImg");
  hintImg.src = CONFIG.hintPhoto;
  hintImg.alt = "A hint for your passkey";

  const passkeyDotsWrap = document.getElementById("passkeyDots");
  const passkeyLen = CONFIG.passkey.length;
  for (let i = 0; i < passkeyLen; i++){
    const d = document.createElement("span");
    passkeyDotsWrap.appendChild(d);
  }
  let typed = "";

  function refreshPasskeyDots(){
    [...passkeyDotsWrap.children].forEach((d, i) => d.classList.toggle("filled", i < typed.length));
  }

  function wrongPasskey(){
    passkeyDotsWrap.classList.add("shake");
    document.getElementById("lockError").classList.add("show");
    setTimeout(() => passkeyDotsWrap.classList.remove("shake"), 400);
    setTimeout(() => { typed = ""; refreshPasskeyDots(); }, 350);
  }

  document.getElementById("keypad").addEventListener("click", (e) => {
    const key = e.target.closest(".key");
    if (!key) return;
    const val = key.dataset.key;

    if (val === "clear"){
      typed = typed.slice(0, -1);
      refreshPasskeyDots();
      return;
    }
    if (val === "enter"){
      if (typed === CONFIG.passkey) goTo("loading");
      else wrongPasskey();
      return;
    }
    if (typed.length >= passkeyLen) return;
    typed += val;
    refreshPasskeyDots();
    if (typed.length === passkeyLen){
      setTimeout(() => {
        if (typed === CONFIG.passkey) goTo("loading");
        else wrongPasskey();
      }, 150);
    }
  });

  // Tapping the hint photo briefly reveals the passkey as a tooltip-ish title
  document.getElementById("hintPhotoBtn").addEventListener("click", () => {
    const el = document.getElementById("lockError");
    el.textContent = `Hint: it's ${CONFIG.passkey}`;
    el.style.color = "var(--gold-soft)";
    el.classList.add("show");
    setTimeout(() => {
      el.classList.remove("show");
      el.style.color = "";
      el.textContent = "Not quite — try again";
    }, 2200);
  });

  /* ---------------- Screen 2: loading ---------------- */
  const loadingMessages = [
    "Preparing something special…",
    "Gathering our favorite memories…",
    "Almost there…"
  ];
  function runLoadingThenAdvance(){
    const el = document.getElementById("loadingText");
    let i = 0;
    el.textContent = loadingMessages[0];
    const iv = setInterval(() => {
      i++;
      if (i < loadingMessages.length){
        el.textContent = loadingMessages[i];
      }
    }, 700);
    setTimeout(() => {
      clearInterval(iv);
      goTo("counter");
    }, 2200);
  }

  /* ---------------- Screen 3: counter ---------------- */
  document.getElementById("counterTitle").textContent = CONFIG.counterTitle;
  document.getElementById("counterSubtitle").textContent = CONFIG.counterSubtitle;

  function diffYMD(from, to){
    let y = to.getFullYear() - from.getFullYear();
    let m = to.getMonth() - from.getMonth();
    let d = to.getDate() - from.getDate();
    if (d < 0){
      m -= 1;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0){ y -= 1; m += 12; }
    return { y, m, d };
  }

  let counterAnimated = false;
  function animateCounter(){
    if (counterAnimated) return;
    counterAnimated = true;
    const from = new Date(CONFIG.togetherSince);
    const { y, m, d } = diffYMD(from, new Date());
    tickTo("numYears", y);
    tickTo("numMonths", m);
    tickTo("numDays", d);
  }
  function tickTo(id, target){
    const el = document.getElementById(id);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const iv = setInterval(() => {
      cur = Math.min(target, cur + step);
      el.textContent = cur;
      if (cur >= target) clearInterval(iv);
    }, 25);
  }

  /* ---------------- Screen 4: memories carousel ---------------- */
  const track = document.getElementById("memoriesTrack");
  const memDots = document.getElementById("memoriesDots");
  CONFIG.photos.forEach((p, i) => {
    const slide = document.createElement("div");
    slide.className = "memory-slide";
    slide.innerHTML = `
      <img src="${p.src}" alt="${p.caption || 'A memory together'}" loading="lazy">
      <div class="memory-caption">${p.caption || ""}</div>
    `;
    track.appendChild(slide);
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("on");
    memDots.appendChild(dot);
  });
  track.addEventListener("scroll", () => {
    const idx = Math.round(track.scrollLeft / track.clientWidth * 1.28);
    [...memDots.children].forEach((d, i) => d.classList.toggle("on", i === Math.min(idx, CONFIG.photos.length - 1)));
  });

  /* ---------------- Screen 5: letter / wax seal ---------------- */
  document.getElementById("letterBody").textContent = CONFIG.letter;

  const sealBtn = document.getElementById("sealBtn");
  const envelopeWrap = document.querySelector(".envelope-wrap");
  const letterCard = document.getElementById("letterCard");

  sealBtn.addEventListener("click", () => {
    sealBtn.classList.add("breaking");
    setTimeout(() => {
      envelopeWrap.classList.add("hidden");
      letterCard.classList.add("open");
    }, 350);
  });
  document.getElementById("letterClose").addEventListener("click", () => {
    letterCard.classList.remove("open");
    envelopeWrap.classList.remove("hidden");
    sealBtn.classList.remove("breaking");
  });
  document.getElementById("restartBtn").addEventListener("click", () => {
    letterCard.classList.remove("open");
    envelopeWrap.classList.remove("hidden");
    sealBtn.classList.remove("breaking");
    typed = ""; refreshPasskeyDots();
    counterAnimated = false;
    document.getElementById("numYears").textContent = "0";
    document.getElementById("numMonths").textContent = "0";
    document.getElementById("numDays").textContent = "0";
    goTo("lock");
  });
  document.getElementById("celebrateBtn").addEventListener("click", burstCelebration);

  /* ---------------- ambient background: drifting embers ---------------- */
  const emberCanvas = document.getElementById("emberCanvas");
  const ectx = emberCanvas.getContext("2d");
  let embers = [];

  function sizeCanvas(canvas){
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
  sizeCanvas(emberCanvas);

  function makeEmber(){
    const isHeart = Math.random() < 0.18;
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 100,
      r: isHeart ? 4 + Math.random() * 3.5 : 1 + Math.random() * 2.2,
      speed: 0.3 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: 0.15 + Math.random() * 0.5,
      isHeart,
      rot: (Math.random() - 0.5) * 0.6
    };
  }
  for (let i = 0; i < 42; i++){
    const e = makeEmber();
    e.y = Math.random() * window.innerHeight;
    embers.push(e);
  }

  function drawHeart(ctx, x, y, r, rot, alpha){
    const s = r / 3.6;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, 3.2);
    ctx.bezierCurveTo(-6, -2.2, -3.2, -6, 0, -3.4);
    ctx.bezierCurveTo(3.2, -6, 6, -2.2, 0, 3.2);
    ctx.closePath();
    ctx.fillStyle = `rgba(198, 124, 136, ${alpha})`;
    ctx.fill();
    ctx.restore();
  }

  function drawEmbers(){
    ectx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ectx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    embers.forEach(e => {
      e.y -= e.speed;
      e.x += e.drift;
      if (e.y < -10){ Object.assign(e, makeEmber()); e.y = window.innerHeight + 10; }
      if (e.isHeart){
        drawHeart(ectx, e.x, e.y, e.r, e.rot, e.alpha);
        return;
      }
      ectx.beginPath();
      ectx.fillStyle = `rgba(217, 171, 109, ${e.alpha})`;
      ectx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ectx.fill();
    });
    requestAnimationFrame(drawEmbers);
  }
  drawEmbers();

  /* ---------------- celebrate burst: hearts + confetti ---------------- */
  const celCanvas = document.getElementById("celebrateCanvas");
  const cctx = celCanvas.getContext("2d");
  sizeCanvas(celCanvas);

  function burstCelebration(){
    const colors = ["#d9ab6d", "#c97b86", "#f4ece1", "#8c4a56"];
    const pieces = [];
    const cx = window.innerWidth / 2;
    for (let i = 0; i < 90; i++){
      pieces.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: window.innerHeight * 0.6,
        vx: (Math.random() - 0.5) * 9,
        vy: -(4 + Math.random() * 9),
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 0
      });
    }
    let frame = 0;
    function animate(){
      frame++;
      cctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      cctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      pieces.forEach(p => {
        p.vy += 0.18;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;
        if (p.y < window.innerHeight + 20) alive = true;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.fillStyle = p.color;
        cctx.globalAlpha = Math.max(0, 1 - p.life / 160);
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cctx.restore();
      });
      if (alive && frame < 200){
        requestAnimationFrame(animate);
      } else {
        cctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }
    animate();
  }

  window.addEventListener("resize", () => {
    sizeCanvas(emberCanvas);
    sizeCanvas(celCanvas);
  });

  /* ---------------- init ---------------- */
  refreshPasskeyDots();
  renderDots();
})();

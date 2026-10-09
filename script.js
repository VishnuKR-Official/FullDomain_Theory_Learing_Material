// ═══════════════════════════════════════════════
//   DevCheat — Multi-Themed Interactive Scripts
// ═══════════════════════════════════════════════

// ── Web Audio API (Multi-Sensory Sounds) ──
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioUnlocked = false;

document.body.addEventListener('click', () => {
  if (!audioUnlocked && audioCtx.state === 'suspended') {
    audioCtx.resume();
    audioUnlocked = true;
  }
}, { once: true });

const playSound = (type) => {
  if (!audioUnlocked || audioCtx.state === 'suspended') return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  if (type === 'hover') { // High, sharp tick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.04);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now); osc.stop(now + 0.04);
  } else if (type === 'click') { // Satisfying synthetic pop
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.start(now); osc.stop(now + 0.15);
  } else if (type === 'scroll-tick') { // Ultra-subtle wooden tick
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    gain.gain.setValueAtTime(0.005, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
    osc.start(now); osc.stop(now + 0.02);
  } else if (type === 'bass') { // Deep satisfying entrance bass drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 1.5);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.start(now); osc.stop(now + 1.5);
  } else if (type === 'copy') { // Copy code sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  }
};

// ── Advanced Touch/Click Ripple ──
document.addEventListener('click', (e) => {
  playSound('click');
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = `${e.clientX}px`; ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  
  const inner = document.createElement('div');
  inner.className = 'click-ripple-inner';
  inner.style.left = `${e.clientX}px`; inner.style.top = `${e.clientY}px`;
  document.body.appendChild(inner);
  
  gsap.fromTo(ripple, { width: 0, height: 0, opacity: 1 }, { width: 200, height: 200, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
  gsap.fromTo(inner, { width: 0, height: 0, opacity: 0.8 }, { width: 80, height: 80, opacity: 0, duration: 0.4, ease: 'power3.out', onComplete: () => inner.remove() });
});

// ── Lenis Smooth Scroll & Scroll Audio ──
const lenis = new Lenis({
  duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);

let lastTickScroll = 0;
lenis.on('scroll', (e) => {
  if (Math.abs(e.animatedScroll - lastTickScroll) > 120) {
    playSound('scroll-tick');
    lastTickScroll = e.animatedScroll;
  }
});

// ── Custom Trailing Cursor & Mouse Blob ──
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const mouseBlob = document.createElement('div');
mouseBlob.classList.add('mouse-blob');
document.body.appendChild(mouseBlob);

let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2, cursorX = mouseX, cursorY = mouseY;
window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
gsap.ticker.add(() => {
  const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
  cursorX += (mouseX - cursorX) * dt; cursorY += (mouseY - cursorY) * dt;
  cursor.style.left = cursorX + 'px'; cursor.style.top = cursorY + 'px';
  mouseBlob.style.left = cursorX + 'px'; mouseBlob.style.top = cursorY + 'px';
});

const bindHover = () => {
  document.querySelectorAll('a, button, pre, .story-box, td').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('active'); if(el.tagName!=='TD') playSound('hover'); });
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
  document.querySelectorAll('h1, h2, h3').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('text-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover'));
  });
};

// ── Dynamic Image, Marquee, & Theme Injection ──
const createMarquee = (text) => {
  const c = document.createElement('div'); c.className = 'marquee-container fade-up';
  const inner = document.createElement('div'); inner.className = 'marquee-content';
  const spans = Array(12).fill(`<span>${text}</span>`).join('');
  inner.innerHTML = spans + spans; c.appendChild(inner); return c;
};
const createImageCard = (url) => {
  const c = document.createElement('div'); c.className = 'image-card fade-up';
  const img = document.createElement('img'); img.src = url; img.className = 'parallax-img';
  c.appendChild(img); return c;
};

// ── Advanced Hero Video & Tutorials Injection ──
const sectionData = {
  '.js-banner': {
    marquee: 'JAVASCRIPT MASTERY ',
    bgVideo: 'https://www.youtube.com/embed/N-zXCVqHpeI?autoplay=1&mute=1&loop=1&playlist=N-zXCVqHpeI&controls=0&showinfo=0&rel=0',
    tutorials: [
      { type: 'Course', title: '100 Seconds of JS', url: 'https://www.youtube.com/embed/Ukg_U3CnJWI' },
      { type: 'Short', title: 'JS Array Methods', url: 'https://www.youtube.com/embed/R8rmfD9Y5-c' }
    ]
  },
  '.node-banner': {
    marquee: 'NODE.JS RUNTIME ',
    bgVideo: 'https://www.youtube.com/embed/bXvN_b_qL00?autoplay=1&mute=1&loop=1&playlist=bXvN_b_qL00&controls=0&showinfo=0&rel=0',
    tutorials: [
      { type: 'Course', title: 'Node in 100 Seconds', url: 'https://www.youtube.com/embed/ENrzD9HAZK4' },
      { type: 'Short', title: 'Node Event Loop', url: 'https://www.youtube.com/embed/L18RHG2DwwA' }
    ]
  },
  '.mongo-banner': {
    marquee: 'MONGODB DATABASE ',
    bgVideo: 'https://www.youtube.com/embed/n4rL5bQeJbA?autoplay=1&mute=1&loop=1&playlist=n4rL5bQeJbA&controls=0&showinfo=0&rel=0',
    tutorials: [
      { type: 'Course', title: 'MongoDB in 100 Seconds', url: 'https://www.youtube.com/embed/-bt_y4Loofg' },
      { type: 'Short', title: 'SQL vs NoSQL', url: 'https://www.youtube.com/embed/ZS_kXvOeQ5Y' }
    ]
  },
  '.proj-banner': {
    marquee: 'PROJECT ARCHITECTURE ',
    bgVideo: 'https://www.youtube.com/embed/7r4xVDI2vho?autoplay=1&mute=1&loop=1&playlist=7r4xVDI2vho&controls=0&showinfo=0&rel=0',
    tutorials: [
      { type: 'Course', title: 'Build a REST API', url: 'https://www.youtube.com/embed/pKd0Rpw7O48' }
    ]
  }
};

Object.keys(sectionData).forEach(selector => {
  const banner = document.querySelector(selector);
  if (banner) {
    // 1. Upgrade Banner to Immersive Hero Section
    banner.classList.add('relative', 'min-h-[60vh]', 'flex', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-[40px]', 'my-12', 'border', 'border-white/10', 'shadow-[0_20px_60px_rgba(0,0,0,0.5)]');
    banner.style.padding = '0';
    
    // Add Iframe Background
    const bgContainer = document.createElement('div');
    bgContainer.className = 'absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40 mix-blend-screen scale-[1.3]';
    bgContainer.innerHTML = `<iframe class="w-full h-full" src="${sectionData[selector].bgVideo}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 w-full h-full z-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent';

    const contentDiv = banner.querySelector('div');
    const iconSpan = banner.querySelector('.chapter-icon');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'z-10 flex flex-col items-center text-center p-8 backdrop-blur-sm rounded-3xl';
    if(iconSpan) wrapper.appendChild(iconSpan);
    if(contentDiv) wrapper.appendChild(contentDiv);
    
    banner.innerHTML = '';
    banner.appendChild(bgContainer);
    banner.appendChild(overlay);
    banner.appendChild(wrapper);

    // 2. Add Top Watched Videos Grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 my-16 w-full max-w-5xl mx-auto z-10 relative';
    
    sectionData[selector].tutorials.forEach(tut => {
      const card = document.createElement('div');
      card.className = 'flex flex-col gap-3 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl hover:bg-white/10 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(var(--accent),0.2)]';
      
      const aspect = tut.type === 'Short' ? 'aspect-[9/16] w-full max-w-[300px] mx-auto' : 'aspect-video w-full';
      
      card.innerHTML = `
        <div class="flex justify-between items-center px-2">
          <span class="text-xs font-black tracking-widest uppercase text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full">${tut.type}</span>
          <span class="text-white/80 text-sm font-semibold">${tut.title}</span>
        </div>
        <div class="${aspect} rounded-2xl overflow-hidden border border-white/10 relative group">
          <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
          <iframe class="w-full h-full relative z-0" src="${tut.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
      grid.appendChild(card);
    });
    
    const vidHeader = document.createElement('h3');
    vidHeader.className = 'text-center text-4xl font-["Fredoka"] mt-12 mb-8 text-[var(--text)] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]';
    vidHeader.innerText = '🔥 Top Watched Tutorials';
    
    banner.after(grid);
    banner.after(vidHeader);
    banner.after(createMarquee(sectionData[selector].marquee));
  }
});

// ── Multi-Theme Scroll Triggering ──
// Switch body data-theme based on scroll position
const themeTriggers = [
  { trigger: '.js-banner', theme: 'light' },
  { trigger: '.node-banner', theme: 'node' },
  { trigger: '.mongo-banner', theme: 'mongo' },
  { trigger: '.proj-banner', theme: 'project' }
];

themeTriggers.forEach(t => {
  const el = document.querySelector(t.trigger);
  if (el) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom top',
      onEnter: () => document.body.setAttribute('data-theme', t.theme),
      onEnterBack: () => document.body.setAttribute('data-theme', t.theme)
    });
  }
});

// ── Bespoke Section Entrance Animations ──
// JS: Elastic Pop
gsap.fromTo('.js-banner h1, .js-banner .chapter-icon', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ease: 'elastic.out(1, 0.5)', duration: 2, stagger: 0.15, scrollTrigger: '.js-banner' });

// Node: Horizontal Skew Tear
gsap.fromTo('.node-banner h1, .node-banner .chapter-icon', { x: -100, skewX: 45, opacity: 0 }, { x: 0, skewX: 0, opacity: 1, ease: 'power4.out', duration: 1.4, stagger: 0.15, scrollTrigger: '.node-banner' });

// Mongo: 3D Flip Fold
gsap.fromTo('.mongo-banner h1, .mongo-banner .chapter-icon', { rotationX: -90, opacity: 0, transformOrigin: 'top center' }, { rotationX: 0, opacity: 1, ease: 'bounce.out', duration: 1.8, stagger: 0.15, scrollTrigger: '.mongo-banner' });

// Project: 3D Y-Axis Spin
gsap.fromTo('.proj-banner h1, .proj-banner .chapter-icon', { rotationY: 180, opacity: 0 }, { rotationY: 0, opacity: 1, ease: 'power3.out', duration: 1.8, stagger: 0.15, scrollTrigger: '.proj-banner' });

// Regular headings (h2) get standard slide up
document.querySelectorAll('h2').forEach(heading => {
  gsap.fromTo(heading, 
    { opacity: 0, y: 40, rotationZ: 2 }, 
    { opacity: 1, y: 0, rotationZ: 0, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: heading, start: 'top 90%', toggleActions: 'play none none reverse' } }
  );
});

document.querySelectorAll('pre, .story-box').forEach(el => {
  gsap.fromTo(el, { opacity: 0, scale: 0.95, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.2)', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
});

document.querySelectorAll('.card p, .card ul, .table-wrap').forEach(el => {
  gsap.fromTo(el, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
});

setTimeout(() => {
  gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.fromTo(img, { y: '-15%' }, { y: '15%', ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  bindHover();
}, 200);

// ── Navbar & Sidebar Filtering Logic ──
const tabBtns = document.querySelectorAll('.tab-btn');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

let currentCategory = '';
document.querySelector('.nav').childNodes.forEach(node => {
  if (node.nodeType === 1) {
    if (node.classList.contains('nav-section-label')) currentCategory = node.textContent.trim();
    else if (node.classList.contains('nav-link')) node.dataset.category = currentCategory;
  }
});

const filterSidebar = (targetCategory) => {
  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.target === targetCategory));
  navLinks.forEach(link => link.classList.toggle('visible', link.dataset.category === targetCategory));
  
  let bannerSelector = '';
  if (targetCategory === 'JavaScript') bannerSelector = '.js-banner';
  else if (targetCategory === 'Node.js') bannerSelector = '.node-banner';
  else if (targetCategory === 'MongoDB') bannerSelector = '.mongo-banner';
  else if (targetCategory === 'Project Guide') bannerSelector = '#project-overview';

  const banner = document.querySelector(bannerSelector);
  if (banner) lenis.scrollTo(banner, { offset: -100 });
};

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => { playSound('click'); filterSidebar(btn.dataset.target); });
});
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    playSound('click'); 
    sidebar.classList.toggle('open'); 
  });
  
  navLinks.forEach(link => { link.addEventListener('click', () => sidebar.classList.remove('open')); });

  // Close sidebar when clicking anywhere outside of it
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('open');
      playSound('click');
    }
  });
}

filterSidebar('JavaScript');

// ── Kinetic Edge Scrolling for Sidebar ──
const sidebarEl = document.querySelector('.sidebar');
let sidebarScrollSpeed = 0;

if (sidebarEl) {
  sidebarEl.addEventListener('mousemove', (e) => {
    const rect = sidebarEl.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const edgeSize = 120; // Hitbox size in pixels from top/bottom
    
    if (relativeY < edgeSize) {
      // Scroll Up
      sidebarScrollSpeed = -Math.pow((edgeSize - relativeY) / edgeSize, 2) * 15;
    } else if (relativeY > rect.height - edgeSize) {
      // Scroll Down
      sidebarScrollSpeed = Math.pow((relativeY - (rect.height - edgeSize)) / edgeSize, 2) * 15;
    } else {
      sidebarScrollSpeed = 0;
    }
  });

  sidebarEl.addEventListener('mouseleave', () => { sidebarScrollSpeed = 0; });

  gsap.ticker.add(() => {
    if (sidebarScrollSpeed !== 0) {
      sidebarEl.scrollTop += sidebarScrollSpeed;
    }
  });
}

// ── Dynamic Content Media Injector (No Duplicates, Highly Relevant) ──
const videoMap = [
  { k: ['history', 'what is javascript'], v: 'dGcsHMXbSOA' },
  { k: ['variable', 'declaration'], v: 'sjyJIdbiW8U' },
  { k: ['scope', 'lexical'], v: 'bD-62OM4igw' },
  { k: ['hoisting', 'tdz'], v: 'EvfRXyKa_GI' },
  { k: ['primitive', 'data types'], v: '71hE3L-b5kQ' },
  { k: ['mutability', 'immutable'], v: '3-B711RzDEw' },
  { k: ['type conversion'], v: '2-iR0hXn3rI' },
  { k: ['truthy', 'falsy'], v: 'XqCDeQO29v8' },
  { k: ['operator', 'ternary', 'short-circuit'], v: 'O8wunCEZfK8' },
  { k: ['loop', 'iteration'], v: 's9wW2PpJsmU' },
  { k: ['function', 'arrow'], v: '3a0I8ICR1Vg' },
  { k: ['closure'], v: 'vKJpN5FAeF4' },
  { k: ['this keyword'], v: 'gvicrj31JOM' },
  { k: ['prototype', 'inheritance'], v: 'Fsp45sWEQGQ' },
  { k: ['built-in method', 'array', 'string'], v: 'R8rmfD9Y5-c' },
  { k: ['destructuring'], v: 'NIq3qLaHCIs' },
  { k: ['spread', 'rest'], v: 'iLx4ma8ZqvQ' },
  { k: ['map vs set', 'object vs array'], v: 'hLgIlN22-s' },
  { k: ['symbol'], v: '4J5hnOCj69w' },
  { k: ['sync', 'async'], v: 'Kpn2ajSa92c' },
  { k: ['callback', 'promise'], v: '8aGhZQkoFbQ' },
  { k: ['async / await'], v: 'V_Kr9OSfDeU' },
  { k: ['fetch api'], v: 'cuEtnrL9-H0' },
  { k: ['event', 'propagation', 'delegation'], v: 'XF1_MlZ5l6M' },
  { k: ['dom', 'bom'], v: 'y17RuWUpcgU' },
  { k: ['shallow copy', 'deep copy'], v: 'c_H8H_L-xQo' },
  { k: ['debounce', 'throttle'], v: 'cjIswDCKgu0' },
  { k: ['crud in nested', 'array of object'], v: '7W43QQKCQlY' },
  { k: ['map', 'filter', 'reduce'], v: 's9wW2PpJsmU' },
  { k: ['what is node'], v: 'ENrzD9HAZK4' },
  { k: ['module', 'node'], v: 'mK54Cn4ceac' },
  { k: ['http vs express'], v: 'SccSCuHhOw0' },
  { k: ['middleware'], v: 'lY6icfhap2o' },
  { k: ['routing', 'param'], v: 'pKd0Rpw7O48' },
  { k: ['auth', 'session', 'cookie'], v: 'mbsmsi7l3r4' },
  { k: ['security', 'vulnerability'], v: 'W7CGW3KTMKA' },
  { k: ['api', 'rest'], v: '-MTSRvTe1eM' },
  { k: ['http status'], v: 'wGjC8xW3oM8' },
  { k: ['mvc', 'mvcs'], v: 'pWbMrx5rVBE' },
  { k: ['what is mongodb', 'database'], v: '-bt_y4Loofg' },
  { k: ['shell command', 'crud', 'mongodb'], v: 'DZBGEVgL2eE' },
  { k: ['aggregation pipeline'], v: 'Kk6Er0c7srU' },
  { k: ['index', 'testing'], v: 'HnbxjK2H9XU' },
  { k: ['scaling', 'replication', 'sharding'], v: 'pGjO6n5nOOM' },
  { k: ['acid', 'base', 'cap theorem'], v: 'k-Yaq8AHlFA' },
  { k: ['schema design'], v: 'leCECSSAE4Q' },
  { k: ['project overview', 'architecture'], v: '7CqJlxBYj-M' },
  { k: ['folder structure'], v: '4b_pG4W2V6E' },
  { k: ['full workflow'], v: 'qY5AEE-U5uY' },
  { k: ['admin portal'], v: 'CBsejb9E7K8' },
  { k: ['user side'], v: 'jC8EIDmJz48' }
];

const fallbackVideos = ['W6NZfCO5SIk', 'hdI2bqOjy3c', 'PkZNo7MF68', 'zQnBQ4tB3ZA'];
let usedVideos = new Set();

document.querySelectorAll('h2').forEach((h2, index) => {
  const text = h2.innerText.toLowerCase();
  const searchWord = text.replace(/[^a-z0-9\s]/g, '').split(' ').filter(w => w.length > 3)[0] || 'code';
  
  // Find specific video mapping
  let videoId = null;
  for (let mapping of videoMap) {
    if (mapping.k.some(keyword => text.includes(keyword)) && !usedVideos.has(mapping.v)) {
      videoId = mapping.v;
      usedVideos.add(mapping.v);
      break;
    }
  }

  // Fallback to avoid missing videos
  if (!videoId) {
    const unusedFallbacks = fallbackVideos.filter(v => !usedVideos.has(v));
    videoId = unusedFallbacks.length > 0 ? unusedFallbacks[0] : 'W6NZfCO5SIk';
    usedVideos.add(videoId);
  }

  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'w-full max-w-4xl mx-auto my-10 fade-up media-block';

  mediaContainer.innerHTML = `
    <div class="rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative group bg-black">
      <div class="absolute top-0 right-0 m-4 px-3 py-1 bg-[var(--accent)] text-black text-xs font-black rounded-full z-20 pointer-events-none drop-shadow-lg uppercase tracking-widest">Tutorial</div>
      <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
      <iframe loading="lazy" title="Concept Video Tutorial" class="w-full h-full aspect-video relative z-0" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
  
  h2.after(mediaContainer);
});

// ── TAILWIND & BUBBLE GLARE SUPER STYLES INJECTION ──
// We dynamically apply Tailwind utility classes to upgrade elements with glassmorphism & gradients
setTimeout(() => {
  // Apply the incredibly glossy 3D Bubble Font to the major headers
  document.querySelectorAll('h1').forEach(h => {
    h.classList.add('bubble-font', 'glare-effect', 'text-8xl', 'md:text-[10rem]', 'lowercase', 'leading-[0.8]', 'py-4', 'tracking-tighter');
  });
  
  // Apply bubble font to the massive scrolling marquees
  document.querySelectorAll('.marquee-content').forEach(m => {
    m.classList.add('bubble-font', 'glare-effect', 'opacity-90');
  });
  
  document.querySelectorAll('h2').forEach(h => {
    // Creative Pill-shaped background for headings complementing the yellowish-orange red theme
    h.classList.add('inline-block', 'px-8', 'py-3', 'rounded-full', 'bg-gradient-to-r', 'from-[#FF0055]', 'to-[#FF8008]', 'text-white', 'shadow-[0_10px_30px_rgba(255,128,8,0.5)]', 'border', 'border-white/20');
  });

  document.querySelectorAll('.story-box').forEach(box => {
    box.style.borderLeft = 'none'; // Override vanilla css
    // Deep Black Cards with White Text
    box.classList.add('backdrop-blur-3xl', 'bg-black/95', 'text-white', 'rounded-3xl', 'border-2', 'border-white/20', 'shadow-[0_20px_50px_0_rgba(0,0,0,0.5)]', 'hover:bg-black', 'transition-all', 'duration-500');
  });

  document.querySelectorAll('pre').forEach(pre => {
    pre.classList.add('ring-1', 'ring-white/10', 'shadow-[0_0_40px_rgba(0,0,0,0.2)]', 'rounded-2xl', 'backdrop-blur-md', 'cursor-pointer', 'group');
    
    // Add Click to Copy functionality and Modal trigger
    pre.title = "Click to copy code";
    pre.addEventListener('click', (e) => {
      navigator.clipboard.writeText(pre.innerText);
      playSound('copy');
      showCopyModal();
    });
  });
}, 100);

// ── MASSIVE UI EXPERIENCE OVERHAUL ──

// 1. Synthesized Audio System (No external MP3s needed)
// audioCtx already declared at top of file

// 2. Entry Modal Logic
const entryModal = document.getElementById('entryModal');
const enterBtn = document.getElementById('enterBtn');

enterBtn.addEventListener('click', () => {
  playSound('bass');
  // Animate Modal out
  entryModal.style.opacity = '0';
  entryModal.style.transform = 'scale(1.5) filter: blur(20px)';
  entryModal.style.pointerEvents = 'none';
  
  // Re-enable scrolling!
  document.body.classList.remove('overflow-hidden');
  
  // Trigger opening animation on body
  gsap.from("body", {
    duration: 2,
    filter: "blur(20px) brightness(3)",
    scale: 0.9,
    ease: "power4.out",
    clearProps: "all"
  });
  
  setTimeout(() => entryModal.remove(), 1000);
});

// 3. 7+ GSAP Transition Styles for ScrollTrigger
const animationStyles = [
  { y: 100, skewY: 10, opacity: 0, duration: 1.2, ease: "back.out(1.7)" }, // 1. Elastic Skew
  { rotationX: 90, transformOrigin: "50% 50% -100px", opacity: 0, duration: 1, ease: "power3.out" }, // 2. 3D Flip In
  { scale: 0.5, filter: "blur(10px)", opacity: 0, duration: 1.5, ease: "expo.out" }, // 3. Blur Scale Reveal
  { x: -100, opacity: 0, duration: 1, ease: "circ.out" }, // 4. Slide Left
  { rotationZ: 15, scale: 1.2, opacity: 0, duration: 1, ease: "power4.out" }, // 5. Spin Zoom Out
  { y: -100, rotationX: -45, opacity: 0, duration: 1.2, ease: "bounce.out" }, // 6. Bounce Drop
  { opacity: 0, filter: "brightness(2)", duration: 1.5, ease: "power2.inOut" } // 7. Flash Fade
];

// Re-bind all h2 and story boxes with random scroll animations
gsap.utils.toArray('h2, .story-box, .grid').forEach(el => {
  const randomAnim = animationStyles[Math.floor(Math.random() * animationStyles.length)];
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      toggleActions: "play none none none" // Fixed stability issue: play once, never reverse
    },
    ...randomAnim
  });
});

// 4. 5+ Dynamic Transformation Styles added randomly to elements
const transformClasses = [
  'hover:scale-105 hover:-translate-y-2 hover:rotate-1', // Lift & tilt
  'hover:scale-[1.02] hover:skew-x-2', // Slight skew
  'hover:translate-x-3 hover:shadow-[10px_10px_0px_rgba(var(--accent),1)]', // Retro shift
  'hover:scale-110 hover:z-50', // Pop out
  'hover:rotate-[-2deg] hover:scale-105' // Reverse tilt
];

document.querySelectorAll('.story-box, pre, .grid > div').forEach(el => {
  // Pick random transform
  const tClass = transformClasses[Math.floor(Math.random() * transformClasses.length)];
  tClass.split(' ').forEach(c => el.classList.add(c));
  el.classList.add('transition-all', 'duration-500');
});

// 5. Code Copy Modal
function showCopyModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_50px_rgba(var(--accent),0.8)] z-[10000] animate-bounce';
  modal.innerText = 'Copied to Clipboard! 🚀';
  document.body.appendChild(modal);
  
  // Animate out
  setTimeout(() => {
    gsap.to(modal, { y: 50, opacity: 0, duration: 0.5, onComplete: () => modal.remove() });
  }, 2000);
}

console.log('%c✨ Multi-Sensory Multi-Theme Architecture Loaded', 'color:#FF3B00;font-size:1.2rem;font-weight:bold;');

// ── Custom Scroll Progress Handle ──
window.addEventListener('scroll', () => {
  const scrollPx = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollPx / winHeightPx) * 100;
  const bar = document.getElementById('scrollProgress');
  if (bar) bar.style.height = `${scrolled}%`;
});

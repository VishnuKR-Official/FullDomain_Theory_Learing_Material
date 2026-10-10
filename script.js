// ═══════════════════════════════════════════════
//   DevCheat — Multi-Themed Interactive Scripts
// ═══════════════════════════════════════════════

// ── Web Audio API (Multi-Sensory Sounds) ──
let audioCtx;
let audioUnlocked = false;

window.initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  audioUnlocked = true;
  startAmbientDrone();
};

document.body.addEventListener('click', window.initAudio, { once: true });

const playSound = (type) => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  if (type === 'hover') { // High, sharp tick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.02);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.start(now); osc.stop(now + 0.02);
  } else if (type === 'click') { // Satisfying synthetic pop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'swoosh') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.15);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'scroll-tick') { // Ultra-subtle smooth tap
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  } else if (type === 'bass') { // Deep satisfying entrance bass drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 1.5);
    gain.gain.setValueAtTime(2.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.start(now); osc.stop(now + 1.5);
  } else if (type === 'door') { // Deep smooth door opening
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 2);
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 2);
    
    osc.disconnect();
    osc.connect(filter);
    filter.connect(gain);
    
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(1.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
    osc.start(now); osc.stop(now + 2);
  } else if (type === 'copy') { // Copy code sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  }
};

// ── Ethereal Ambient Drone Generator ──
let droneActive = false;
const startAmbientDrone = () => {
  if (droneActive || !audioCtx) return;
  droneActive = true;
  const rootFreq = 220; 
  const freqs = [rootFreq, rootFreq * 1.5, rootFreq * 2]; 
  freqs.forEach(freq => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    lfo.type = 'sine';
    lfo.frequency.value = 0.05 + (Math.random() * 0.05);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.01;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 5);
    osc.start();
    lfo.start();
  });
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
  document.querySelectorAll('a:not(.magnetic), button:not(.magnetic), pre, .story-box, td').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('active'); if(el.tagName!=='TD') playSound('hover'); });
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
  document.querySelectorAll('h1, h2, h3').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('text-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover'));
  });
  // Magnetic Buttons
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
      cursor.classList.add('magnetic-hover');
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      cursor.classList.remove('magnetic-hover');
    });
    el.addEventListener('mouseenter', () => { playSound('hover'); cursor.classList.add('magnetic-hover'); });
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
    
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 w-full h-full z-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent';

    const contentDiv = banner.querySelector('div');
    const iconSpan = banner.querySelector('.chapter-icon');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'z-10 flex flex-col items-center text-center p-8 backdrop-blur-sm rounded-3xl';
    if(iconSpan) wrapper.appendChild(iconSpan);
    if(contentDiv) wrapper.appendChild(contentDiv);
    
    banner.innerHTML = '';
    banner.appendChild(overlay);
    banner.appendChild(wrapper);

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
    { opacity: 1, y: 0, rotationZ: 0, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: heading, start: 'top 98%', toggleActions: 'play none none none' } }
  );
});

document.querySelectorAll('pre, .story-box').forEach(el => {
  gsap.fromTo(el, { opacity: 0, scale: 0.95, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.2)', scrollTrigger: { trigger: el, start: 'top 98%', toggleActions: 'play none none none' } });
});

document.querySelectorAll('.card p, .card ul, .table-wrap').forEach(el => {
  gsap.fromTo(el, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 98%', toggleActions: 'play none none none' } });
});

setTimeout(() => {
  gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.fromTo(img, { y: '-15%' }, { y: '15%', ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  bindHover();
}, 200);

// ── Navbar & Sidebar Filtering Logic ──
const tabBtns = document.querySelectorAll('.tab-btn, .mobile-tab-btn');
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
  else if (targetCategory === 'Project Guide') bannerSelector = '.proj-banner';

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

// ── Kinetic Horizontal Edge Scrolling for Code & Tables ──
let horizontalScrollSpeed = 0;
let activeScrollTarget = null;

document.addEventListener('mousemove', (e) => {
  const target = e.target.closest('pre, .table-wrap');
  
  if (target && target.scrollWidth > target.clientWidth) {
    const rect = target.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const edgeSize = 100; // Hover area size from edge
    
    if (relativeX < edgeSize) {
      // Scroll Left
      horizontalScrollSpeed = -Math.pow((edgeSize - relativeX) / edgeSize, 2) * 20;
      activeScrollTarget = target;
    } else if (relativeX > rect.width - edgeSize) {
      // Scroll Right
      horizontalScrollSpeed = Math.pow((relativeX - (rect.width - edgeSize)) / edgeSize, 2) * 20;
      activeScrollTarget = target;
    } else {
      horizontalScrollSpeed = 0;
      activeScrollTarget = null;
    }
  } else {
    horizontalScrollSpeed = 0;
    activeScrollTarget = null;
  }
});

document.addEventListener('mouseleave', () => { horizontalScrollSpeed = 0; activeScrollTarget = null; });

gsap.ticker.add(() => {
  if (horizontalScrollSpeed !== 0 && activeScrollTarget) {
    activeScrollTarget.scrollLeft += horizontalScrollSpeed;
  }
});

// ── Dynamic Content Media Injector (No Duplicates, Highly Relevant) ──
// Removed per user request.

// ── TAILWIND & BUBBLE GLARE SUPER STYLES INJECTION ──
// We dynamically apply Tailwind utility classes to upgrade elements with glassmorphism & gradients
setTimeout(() => {
  // Apply the incredibly glossy 3D Bubble Font to the major headers
  document.querySelectorAll('h1').forEach(h => {
    h.classList.add('bubble-font', 'glare-effect', 'text-5xl', 'md:text-7xl', 'lg:text-[10rem]', 'lowercase', 'leading-[0.8]', 'py-4', 'tracking-tighter');
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

// 2. Seamless Preloader & Audio Unmute Logic
const entryModal = document.getElementById('entryModal');
const unmuteBtn = document.getElementById('unmuteBtn');
const unmuteIcon = document.getElementById('unmuteIcon');
let isAudioEnabled = false;

window.addEventListener('load', () => {
  if (entryModal) {
    // Add slight delay so preloader is visible briefly
    setTimeout(() => {
      entryModal.style.opacity = '0';
      document.body.classList.remove('overflow-hidden');
      setTimeout(() => entryModal.remove(), 1000);
      
      // Intro fade in
      gsap.from("body", {
        duration: 2,
        filter: "blur(10px)",
        ease: "power2.out",
        clearProps: "all"
      });
    }, 1000);
  }
});

if (unmuteBtn) {
  unmuteBtn.addEventListener('click', () => {
    if (!isAudioEnabled) {
      initAudio();
      playSound('door'); // Feedback sound
      isAudioEnabled = true;
      unmuteBtn.classList.add('bg-[var(--accent)]');
      unmuteIcon.classList.replace('text-slate-400', 'text-white');
      unmuteIcon.classList.remove('group-hover:text-[var(--accent)]');
      
      // Update icon to "speaker-on"
      unmuteIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
    } else {
      // Mute (Suspend context)
      if (audioCtx) {
        audioCtx.suspend();
        isAudioEnabled = false;
        unmuteBtn.classList.remove('bg-[var(--accent)]');
        unmuteIcon.classList.replace('text-white', 'text-slate-400');
        unmuteIcon.classList.add('group-hover:text-[var(--accent)]');
        
        // Update icon to "speaker-off"
        unmuteIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
      }
    }
  });
}

// 3. Fluid Staggered Scroll Reveal (Stripe-style)
gsap.utils.toArray('.card, pre, .story-box').forEach((el, i) => {
  gsap.fromTo(el, 
    { y: 60, opacity: 0, scale: 0.98 }, 
    {
      y: 0, opacity: 1, scale: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    }
  );
});

// Refresh ScrollTrigger to calculate heights correctly after all initial dynamic changes
setTimeout(() => {
  ScrollTrigger.refresh();
}, 2000);

// 4. Premium Magnetic 3D Glass Hover (Tactile effect)
document.querySelectorAll('.card, pre, .story-box, .grid > div').forEach(el => {
  el.classList.add('transition-transform', 'duration-300', 'ease-out');
  
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg rotation
    const rotateY = ((x - centerX) / centerX) * 4;
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
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

// ── Custom Scroll Progress Handle & Sidebar Fill ──
let lastScrollPercent = 0;
window.addEventListener('scroll', () => {
  const scrollPx = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollPx / winHeightPx) * 100;
  const bar = document.getElementById('scrollProgress');
  if (bar) bar.style.height = `${scrolled}%`;
  
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.style.background = `linear-gradient(to bottom, #0396FF ${scrolled}%, #050505 ${scrolled}%)`;
  }
  
  if (Math.abs(scrolled - lastScrollPercent) > 5) {
    playSound('swoosh');
    lastScrollPercent = scrolled;
  }
});

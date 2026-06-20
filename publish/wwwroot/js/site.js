const loaderMsgs = ['INITIALIZING...','SCANNING NETWORK...','LOADING STATIONS...','READY.'];
let msgIdx = 0;
const pctEl = document.getElementById('loader-pct');
const loader = document.getElementById('loader');

const msgInterval = setInterval(() => {
  msgIdx = (msgIdx + 1) % loaderMsgs.length;
  if (pctEl) pctEl.textContent = loaderMsgs[msgIdx];
}, 350);

function hideLoader() {
  clearInterval(msgInterval);
  if (pctEl) pctEl.textContent = 'READY.';
  setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 400);
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 1400);
  initializeMap();
});

const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 80;

if (canvas && ctx) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#00F5FF' : '#39FF14'
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 245, 255, ${0.05 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.section-eyebrow, .section-title, .section-desc, .step-card, .stat-item, .feature-item, .pricing-card, .testi-card, .map-container, #cta-title'
).forEach(el => observer.observe(el));

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(ease * target);
    el.textContent = value.toString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.stat-number');
      items.forEach(el => {
        const target = parseInt(el.dataset.target || '0', 10);
        if (!Number.isNaN(target)) animateCounter(el, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

document.querySelectorAll('.step-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const glow = card.querySelector('.step-glow');
    if (glow) {
      glow.style.left = (e.clientX - rect.left - 80) + 'px';
      glow.style.top = (e.clientY - rect.top - 80) + 'px';
    }
  });
});

let chargeLevel = 74;
const pctTextEl = document.getElementById('pct-text');
setInterval(() => {
  if (chargeLevel < 100) {
    chargeLevel += 0.1;
    if (pctTextEl) {
      pctTextEl.textContent = `${Math.round(chargeLevel)}%`;
    }
  }
}, 800);

const stations = [
  { name: 'CyberHub Station', address: 'Banjara Hills, Hyderabad', status: 'Online', power: '120 kW', price: '₹8 / kWh', coords: [17.4324, 78.4505], available: true },
  { name: 'SolarPoint Charge', address: 'Gachibowli, Hyderabad', status: 'Busy', power: '100 kW', price: '₹9 / kWh', coords: [17.4450, 78.3498], available: false },
  { name: 'MetroCharge Plaza', address: 'Hitech City, Hyderabad', status: 'Online', power: '120 kW', price: '₹8 / kWh', coords: [17.4456, 78.3785], available: true },
  { name: 'GreenGrid Hub', address: 'Kondapur, Hyderabad', status: 'Online', power: '80 kW', price: '₹9 / kWh', coords: [17.4400, 78.3889], available: true },
  { name: 'RapidVolt Center', address: 'Madhapur, Hyderabad', status: 'Busy', power: '120 kW', price: '₹8 / kWh', coords: [17.4420, 78.3928], available: false },
  { name: 'ChargeWave Point', address: 'Ameerpet, Hyderabad', status: 'Online', power: '90 kW', price: '₹8.5 / kWh', coords: [17.4380, 78.4480], available: true },
  { name: 'ElectroPulse Yard', address: 'Secunderabad, Hyderabad', status: 'Online', power: '110 kW', price: '₹8 / kWh', coords: [17.4447, 78.5023], available: true },
  { name: 'VoltNest Station', address: 'Miyapur, Hyderabad', status: 'Online', power: '100 kW', price: '₹9 / kWh', coords: [17.4948, 78.3824], available: true },
  { name: 'ChargeGrid Depot', address: 'Kukatpally, Hyderabad', status: 'Online', power: '120 kW', price: '₹8 / kWh', coords: [17.4506, 78.3954], available: true },
  { name: 'NeonCharge Plaza', address: 'Secunderabad, Hyderabad', status: 'Online', power: '120 kW', price: '₹8 / kWh', coords: [17.4456, 78.4989], available: true }
];

function initializeMap() {
  const mapElement = document.getElementById('hyd-map');
  const cardsElement = document.getElementById('station-cards');

  if (!mapElement || !cardsElement || typeof L === 'undefined') return;

  const map = L.map(mapElement).setView([17.4368, 78.4500], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  stations.forEach((station) => {
    const marker = L.circleMarker(station.coords, {
      radius: 8,
      fillColor: station.available ? '#39FF14' : '#FFB800',
      color: station.available ? '#00F5FF' : '#FFB800',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindPopup(`
      <strong>${station.name}</strong><br />
      ${station.address}<br />
      <span style="color: ${station.available ? '#39FF14' : '#FFB800'}; font-weight: 700;">${station.status}</span><br />
      ${station.power} · ${station.price}
    `);

    const card = document.createElement('div');
    card.style.background = 'rgba(13, 27, 62, 0.75)';
    card.style.border = '1px solid rgba(0,245,255,0.12)';
    card.style.backdropFilter = 'blur(15px)';
    card.style.padding = '1.2rem';
    card.style.borderRadius = '12px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '0.6rem';

    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between; gap:0.75rem;">
        <div>
          <div style="font-family: 'Orbitron', monospace; font-size: 0.85rem; color: #fff; font-weight: 700;">${station.name}</div>
          <div style="font-size: 0.8rem; color: #8B9DBF;">${station.address}</div>
        </div>
        <div style="font-family: 'Orbitron', monospace; font-size: 0.65rem; letter-spacing: 0.2em; color: ${station.available ? '#39FF14' : '#FFB800'};">${station.status.toUpperCase()}</div>
      </div>
      <div style="font-size: 0.85rem; color: #fff;">${station.power} · ${station.price}</div>
      <button style="margin-top: auto; padding: 0.7rem 1rem; border:none; background: rgba(0,245,255,0.15); color:#fff; font-family:'Orbitron',monospace; letter-spacing:0.08em; cursor:pointer;">View on Map</button>
    `;

    card.querySelector('button')?.addEventListener('click', () => {
      map.setView(station.coords, 15, { animate: true });
      marker.openPopup();
    });

    cardsElement.appendChild(card);
  });
}

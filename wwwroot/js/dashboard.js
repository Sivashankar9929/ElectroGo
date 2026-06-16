document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('btn-start');
  const stopBtn = document.getElementById('btn-stop');
  const historyRows = document.getElementById('history-rows');
  const pagination = document.getElementById('history-pagination');
  const searchInput = document.getElementById('history-search');
  const energyChart = document.getElementById('energy-chart');
  const spendChart = document.getElementById('spend-chart');
  const costPieChart = document.getElementById('cost-pie-chart');
  const speedChart = document.getElementById('speed-chart');
  const themeToggle = document.getElementById('theme-toggle');

  const historyData = [
    { date: '2026-06-12', station: 'CyberHub Station', energy: '31.4 kWh', duration: '36m', status: 'Paid', cost: '₹253' },
    { date: '2026-06-09', station: 'SolarPoint Charge', energy: '28.8 kWh', duration: '34m', status: 'Paid', cost: '₹232' },
    { date: '2026-06-06', station: 'GreenGrid Hub', energy: '22.0 kWh', duration: '28m', status: 'Paid', cost: '₹181' },
    { date: '2026-06-04', station: 'RapidVolt Center', energy: '35.0 kWh', duration: '39m', status: 'Paid', cost: '₹282' },
    { date: '2026-06-02', station: 'MetroCharge Plaza', energy: '27.2 kWh', duration: '32m', status: 'Paid', cost: '₹219' },
    { date: '2026-05-29', station: 'ChargeWave Point', energy: '24.8 kWh', duration: '31m', status: 'Paid', cost: '₹199' }
  ];

  let currentPage = 1;
  const rowsPerPage = 4;
  let filteredHistory = [...historyData];

  function renderHistory() {
    historyRows.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = filteredHistory.slice(start, start + rowsPerPage);
    pageRows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.date}</td><td>${row.station}</td><td>${row.energy}</td><td>${row.duration}</td><td>${row.status}</td><td>${row.cost}</td>`;
      historyRows.appendChild(tr);
    });
  }

  function renderPagination() {
    pagination.innerHTML = '';
    const pageCount = Math.ceil(filteredHistory.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
      const btn = document.createElement('button');
      btn.className = i === currentPage ? 'page-btn active' : 'page-btn';
      btn.textContent = i.toString();
      btn.addEventListener('click', () => {
        currentPage = i;
        renderHistory();
        renderPagination();
      });
      pagination.appendChild(btn);
    }
  }

  function updateCharts() {
    // Energy consumption trend chart
    if (energyChart) {
      energyChart.innerHTML = '<div class="chart-sparkline"><span style="--level:0.35"></span><span style="--level:0.5"></span><span style="--level:0.28"></span><span style="--level:0.7"></span><span style="--level:0.55"></span><span style="--level:0.95"></span><span style="--level:0.8"></span></div>';
    }
    
    // Spend overview chart
    if (spendChart) {
      spendChart.innerHTML = '<div class="bar-item" style="--height:0.55"></div><div class="bar-item" style="--height:0.74"></div><div class="bar-item" style="--height:0.62"></div><div class="bar-item" style="--height:0.88"></div><div class="bar-item" style="--height:0.78"></div>';
    }

    // Cost Distribution Pie Chart
    if (costPieChart && typeof Chart !== 'undefined') {
      const costCtx = costPieChart.getContext('2d');
      new Chart(costCtx, {
        type: 'doughnut',
        data: {
          labels: ['Peak Hours', 'Off-Peak', 'Weekend', 'Others'],
          datasets: [{
            data: [35, 25, 30, 10],
            backgroundColor: [
              'rgba(0, 245, 255, 0.8)',
              'rgba(57, 255, 20, 0.8)',
              'rgba(255, 184, 0, 0.8)',
              'rgba(255, 107, 107, 0.8)'
            ],
            borderColor: [
              'rgba(0, 245, 255, 1)',
              'rgba(57, 255, 20, 1)',
              'rgba(255, 184, 0, 1)',
              'rgba(255, 107, 107, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'rgba(139, 157, 191, 1)',
                font: { size: 12, weight: '600' },
                padding: 15
              }
            }
          }
        }
      });
    }

    // Charging Speed Breakdown Chart
    if (speedChart && typeof Chart !== 'undefined') {
      const speedCtx = speedChart.getContext('2d');
      new Chart(speedCtx, {
        type: 'bar',
        data: {
          labels: ['Slow\n(0-50kW)', 'Fast\n(50-120kW)', 'Ultra-Fast\n(120kW+)'],
          datasets: [{
            label: 'Sessions',
            data: [8, 18, 12],
            backgroundColor: [
              'rgba(255, 184, 0, 0.8)',
              'rgba(0, 245, 255, 0.8)',
              'rgba(57, 255, 20, 0.8)'
            ],
            borderColor: [
              'rgba(255, 184, 0, 1)',
              'rgba(0, 245, 255, 1)',
              'rgba(57, 255, 20, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(0, 245, 255, 0.1)' },
              ticks: { color: 'rgba(139, 157, 191, 1)' }
            },
            y: {
              grid: { display: false },
              ticks: { color: 'rgba(139, 157, 191, 1)' }
            }
          }
        }
      });
    }
  }

  function setLoading(button, state) {
    if (!button) return;
    button.disabled = state;
    button.textContent = state ? 'Processing...' : button.dataset.label;
  }

  if (startBtn) {
    startBtn.dataset.label = 'Start Charging';
    startBtn.addEventListener('click', () => {
      if (!confirm('Start charging session now?')) return;
      setLoading(startBtn, true);
      setTimeout(() => setLoading(startBtn, false), 1400);
    });
  }

  if (stopBtn) {
    stopBtn.dataset.label = 'Stop Charging';
    stopBtn.addEventListener('click', () => {
      if (!confirm('Stop the current charging session?')) return;
      setLoading(stopBtn, true);
      setTimeout(() => setLoading(stopBtn, false), 1400);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      filteredHistory = historyData.filter(item =>
        item.date.includes(query) ||
        item.station.toLowerCase().includes(query) ||
        item.energy.includes(query) ||
        item.duration.includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.cost.includes(query)
      );
      currentPage = 1;
      renderHistory();
      renderPagination();
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
  }

  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sectionLinks = Array.from(sidebarLinks).filter(link => link.hash || link.getAttribute('href') === '/Dashboard');
  const dashboardSections = Array.from(document.querySelectorAll('section[id]'));

  function setActiveSidebarLink(activeLink) {
    sidebarLinks.forEach(link => link.classList.toggle('active', link === activeLink));
  }

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  sectionLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const targetId = href.startsWith('#') ? href.substring(1) : href === '/Dashboard' ? 'top' : '';

    if (href.startsWith('#')) {
      link.addEventListener('click', event => {
        event.preventDefault();
        scrollToSection(targetId);
        setActiveSidebarLink(link);
        history.replaceState(null, '', href);
      });
    } else if (href === '/Dashboard') {
      link.addEventListener('click', event => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSidebarLink(link);
        history.replaceState(null, '', window.location.pathname);
      });
    }
  });

  function updateActiveSection() {
    const scrollPos = window.scrollY + 120;
    let active = null;

    for (const section of dashboardSections) {
      const rect = section.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      if (top <= scrollPos) {
        active = section;
      }
    }

    if (active) {
      const matchingLink = Array.from(sidebarLinks).find(link => link.getAttribute('href') === `#${active.id}`);
      if (matchingLink) {
        setActiveSidebarLink(matchingLink);
      }
    }
  }

  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();

  renderHistory();
  renderPagination();
  updateCharts();
});

/**
 * AI-Enabled Microplastics Detection System
 * Dashboard Analytics & Dynamic Chart.js Rendering
 */

let morphologyChartInstance = null;
let trendsChartInstance = null;
let locationChartInstance = null;
let sizeHistogramInstance = null;

function renderDashboardKPIs(samples) {
  const total = samples.length;
  const analyzed = samples.filter(s => s.status !== 'Awaiting Analysis').length;
  const flagged = samples.filter(s => s.status === 'Flagged Particles').length;
  const awaiting = samples.filter(s => s.status === 'Awaiting Analysis').length;

  // Calculate mean concentration across analyzed samples with volume > 0
  const validSamples = samples.filter(s => s.candidateCount !== null && s.volume > 0);
  let totalParticles = 0;
  let totalVolume = 0;
  validSamples.forEach(s => {
    totalParticles += s.candidateCount;
    totalVolume += s.volume;
  });
  const meanConcentration = totalVolume > 0 ? (totalParticles / totalVolume).toFixed(2) : '0.00';

  document.getElementById('kpiTotalSamples').textContent = total;
  document.getElementById('kpiAnalyzed').textContent = analyzed;
  document.getElementById('kpiAnalyzedPct').textContent = total > 0 ? `${Math.round((analyzed / total) * 100)}%` : '0%';
  document.getElementById('kpiFlagged').textContent = flagged;
  document.getElementById('kpiAwaiting').textContent = awaiting;
  document.getElementById('kpiMeanConcentration').textContent = meanConcentration;
}

function renderCharts(samples) {
  // Aggregate morphology distribution
  let fiberCount = 0;
  let fragmentCount = 0;
  let filmCount = 0;
  let beadCount = 0;

  let sizeBins = {
    '10-50 µm': 0,
    '50-100 µm': 0,
    '100-300 µm': 0,
    '300-500 µm': 0,
    '>500 µm': 0
  };

  samples.forEach(s => {
    if (s.particles && Array.isArray(s.particles)) {
      s.particles.forEach(p => {
        if (p.type === 'fiber') fiberCount++;
        else if (p.type === 'fragment') fragmentCount++;
        else if (p.type === 'film') filmCount++;
        else if (p.type === 'bead') beadCount++;

        // Bin sizes
        const size = p.size_um || 50;
        if (size <= 50) sizeBins['10-50 µm']++;
        else if (size <= 100) sizeBins['50-100 µm']++;
        else if (size <= 300) sizeBins['100-300 µm']++;
        else if (size <= 500) sizeBins['300-500 µm']++;
        else sizeBins['>500 µm']++;
      });
    }
  });

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.06)';

  // Chart 1: Morphology Distribution
  const ctxMorphology = document.getElementById('morphologyChart');
  if (ctxMorphology) {
    if (morphologyChartInstance) morphologyChartInstance.destroy();
    morphologyChartInstance = new Chart(ctxMorphology, {
      type: 'doughnut',
      data: {
        labels: ['Fibers', 'Fragments', 'Films', 'Beads/Pellets'],
        datasets: [{
          data: [fiberCount || 8, fragmentCount || 12, filmCount || 4, beadCount || 7],
          backgroundColor: ['#38bdf8', '#f43f5e', '#10b981', '#eab308'],
          borderColor: isDark ? '#131f37' : '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 15 }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} particles (${((ctx.raw / (fiberCount + fragmentCount + filmCount + beadCount || 1)) * 100).toFixed(1)}%)`
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  // Chart 2: Timeline Trends
  const ctxTrends = document.getElementById('trendsChart');
  if (ctxTrends) {
    if (trendsChartInstance) trendsChartInstance.destroy();
    
    // Sort samples by date
    const sorted = [...samples].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = sorted.map(s => s.date);
    const particleCounts = sorted.map(s => s.candidateCount !== null ? s.candidateCount : 0);
    const volumes = sorted.map(s => s.volume);

    trendsChartInstance = new Chart(ctxTrends, {
      type: 'line',
      data: {
        labels: dates.length ? dates : ['2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11', '2026-10-12'],
        datasets: [
          {
            label: 'Candidate Particles',
            data: particleCounts.length ? particleCounts : [0, 5, 0, 22, 14],
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#38bdf8',
            pointRadius: 4
          },
          {
            label: 'Sample Volume (L)',
            data: volumes.length ? volumes : [8, 1.5, 2, 10, 5],
            borderColor: '#10b981',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false,
            tension: 0.35,
            pointBackgroundColor: '#10b981',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  // Chart 3: Concentration by Location
  const ctxLocation = document.getElementById('locationConcentrationChart');
  if (ctxLocation) {
    if (locationChartInstance) locationChartInstance.destroy();

    const locLabels = samples.slice(0, 5).map(s => s.location.split(' - ')[0] || s.location);
    const locConcs = samples.slice(0, 5).map(s => (s.candidateCount !== null && s.volume > 0) ? (s.candidateCount / s.volume).toFixed(2) : 0);

    locationChartInstance = new Chart(ctxLocation, {
      type: 'bar',
      data: {
        labels: locLabels,
        datasets: [{
          label: 'Concentration (particles/L)',
          data: locConcs,
          backgroundColor: '#0ea5e9',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, maxRotation: 25 } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  // Chart 4: Calibrated Size Distribution Histogram
  const ctxSize = document.getElementById('sizeHistogramChart');
  if (ctxSize) {
    if (sizeHistogramInstance) sizeHistogramInstance.destroy();
    sizeHistogramInstance = new Chart(ctxSize, {
      type: 'bar',
      data: {
        labels: Object.keys(sizeBins),
        datasets: [{
          label: 'Particle Count',
          data: Object.values(sizeBins),
          backgroundColor: '#14b8a6',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }
}

function renderRecentTable(samples) {
  const tbody = document.getElementById('recentSamplesTbody');
  const emptyState = document.getElementById('tableEmptyState');
  if (!tbody) return;

  const searchVal = (document.getElementById('recentSearchInput')?.value || '').toLowerCase().trim();
  const statusVal = document.getElementById('statusFilterSelect')?.value || 'ALL';

  const filtered = samples.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchVal) || 
                          s.location.toLowerCase().includes(searchVal) ||
                          s.sourceType.toLowerCase().includes(searchVal);
    const matchesStatus = statusVal === 'ALL' || s.status === statusVal;
    return matchesSearch && matchesStatus;
  });

  if (!filtered.length) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = filtered.slice(0, 6).map(s => {
    const statusBadgeClass = {
      'Flagged Particles': 'badge-danger',
      'Non-Detected': 'badge-active',
      'Awaiting Analysis': 'badge-demo'
    }[s.status] || 'badge-info';

    const conc = (s.candidateCount !== null && s.volume > 0) 
      ? `${(s.candidateCount / s.volume).toFixed(2)} part/L` 
      : '—';

    return `
      <tr>
        <td class="mono" style="font-weight: 700; color: var(--accent-cyan);">${s.id}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${s.location}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${s.notes ? s.notes.slice(0, 50) + '...' : ''}</div>
        </td>
        <td><span class="badge" style="background: rgba(255,255,255,0.05);">${s.sourceType}</span></td>
        <td class="mono" style="font-size: 0.82rem;">${s.date}</td>
        <td class="mono">${s.volume} L</td>
        <td class="mono" style="font-weight: 700; color: ${s.candidateCount > 0 ? '#f43f5e' : 'inherit'};">
          ${s.candidateCount !== null ? s.candidateCount : '<span class="badge badge-demo">Pending</span>'}
        </td>
        <td class="mono" style="font-size: 0.85rem;">${conc}</td>
        <td><span class="badge ${statusBadgeClass}">${s.status}</span></td>
        <td style="text-align: right;">
          <a href="analysis.html?id=${encodeURIComponent(s.id)}" class="btn btn-outline btn-sm" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;">
            Inspect
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function initDashboard() {
  const samples = WaterQualityDB.getSamples();
  renderDashboardKPIs(samples);
  renderCharts(samples);
  renderRecentTable(samples);

  // Search and filter listeners
  document.getElementById('recentSearchInput')?.addEventListener('input', () => {
    renderRecentTable(WaterQualityDB.getSamples());
  });

  document.getElementById('statusFilterSelect')?.addEventListener('change', () => {
    renderRecentTable(WaterQualityDB.getSamples());
  });

  // Export CSV button
  document.getElementById('btnExportCSV')?.addEventListener('click', () => {
    WaterQualityDB.exportCSV();
  });

  // Reset demo data button
  document.getElementById('btnResetDemoData')?.addEventListener('click', () => {
    if (confirm('Reset all demo samples back to default laboratory baseline?')) {
      WaterQualityDB.resetDemoData();
      const freshSamples = WaterQualityDB.getSamples();
      renderDashboardKPIs(freshSamples);
      renderCharts(freshSamples);
      renderRecentTable(freshSamples);
      showToast('Laboratory dataset restored to default demo state', 'success');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

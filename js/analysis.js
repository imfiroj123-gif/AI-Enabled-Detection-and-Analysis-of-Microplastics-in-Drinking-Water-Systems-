/**
 * AI-Enabled Microplastics Detection System
 * Optical Analysis, Canvas Bounding Boxes & Particle Quantification
 */

let currentSample = null;
let currentImage = new Image();
let hoveredParticle = null;
let selectedParticleId = null;

function getSampleFromUrlOrLatest() {
  const params = new URLSearchParams(window.location.search);
  const sampleId = params.get('id');
  const samples = WaterQualityDB.getSamples();

  if (sampleId) {
    const found = WaterQualityDB.getSampleById(sampleId);
    if (found) return found;
  }
  return samples.length ? samples[0] : null;
}

function initAnalysisPage() {
  currentSample = getSampleFromUrlOrLatest();
  if (!currentSample) {
    showToast('No sample records found in local database.', 'warning');
    return;
  }

  populateSampleDropdown();
  renderSampleDetails(currentSample);
  setupCanvas(currentSample);
  renderParticleInventory(currentSample);
  setupEventListeners();
}

function populateSampleDropdown() {
  const dropdown = document.getElementById('sampleSelectDropdown');
  if (!dropdown) return;

  const samples = WaterQualityDB.getSamples();
  dropdown.innerHTML = samples.map(s => `
    <option value="${s.id}" ${s.id === currentSample.id ? 'selected' : ''}>
      ${s.id} - ${s.sourceType}
    </option>
  `).join('');

  dropdown.addEventListener('change', (e) => {
    window.location.href = `analysis.html?id=${encodeURIComponent(e.target.value)}`;
  });
}

function renderSampleDetails(sample) {
  // Title and header
  document.getElementById('analysisSampleId').textContent = sample.id;
  document.getElementById('analysisLocation').textContent = `${sample.location} • Collected: ${sample.date} • Mesh: ${sample.meshSize}`;

  // Status badge
  const statusBadge = document.getElementById('analysisStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = sample.status;
    statusBadge.className = 'badge ' + ({
      'Flagged Particles': 'badge-danger',
      'Non-Detected': 'badge-active',
      'Awaiting Analysis': 'badge-demo'
    }[sample.status] || 'badge-info');
  }

  // Metrics
  const count = sample.candidateCount !== null ? sample.candidateCount : 0;
  const vol = sample.volume || 1.0;
  const conc = (count / vol).toFixed(2);

  document.getElementById('resCandidateCount').textContent = count;
  document.getElementById('resVolume').textContent = `${vol} L`;
  document.getElementById('resConcentration').textContent = conc;

  // Confidence & Size Range
  if (sample.particles && sample.particles.length > 0) {
    const confidences = sample.particles.map(p => p.confidence || 0.85);
    const meanConf = Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100);
    document.getElementById('resConfidence').textContent = `${meanConf}%`;

    const sizes = sample.particles.map(p => p.size_um || 50);
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);
    document.getElementById('resSizeRange').textContent = `${minSize} - ${maxSize} µm`;
  } else {
    document.getElementById('resConfidence').textContent = sample.candidateCount === 0 ? '99.5%' : 'N/A';
    document.getElementById('resSizeRange').textContent = sample.candidateCount === 0 ? 'None (0 µm)' : '—';
  }

  document.getElementById('inventoryCountBadge').textContent = `${sample.particles ? sample.particles.length : 0} Objects`;
}

function setupCanvas(sample) {
  const canvas = document.getElementById('analysisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  currentImage = new Image();
  currentImage.src = sample.image || 'assets/images/sample_microscope_slide.jpg';

  currentImage.onload = () => {
    // Set internal resolution to match actual image
    canvas.width = currentImage.naturalWidth || 800;
    canvas.height = currentImage.naturalHeight || 600;
    drawCanvas();
  };

  currentImage.onerror = () => {
    // Fallback if image fails to load
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px Plus Jakarta Sans';
    ctx.fillText('Optical Slide Micrograph Simulation', 30, 40);
    drawCanvas();
  };
}

function drawCanvas() {
  const canvas = document.getElementById('analysisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Clear & draw background image
  ctx.clearRect(0, 0, w, h);
  if (currentImage.complete && currentImage.naturalWidth > 0) {
    ctx.drawImage(currentImage, 0, 0, w, h);
  } else {
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, w, h);
  }

  const showBoxes = document.getElementById('chkShowBoxes')?.checked ?? true;
  const showLabels = document.getElementById('chkShowLabels')?.checked ?? true;
  const filterType = document.getElementById('filterParticleType')?.value || 'ALL';

  if (!showBoxes || !currentSample.particles) return;

  currentSample.particles.forEach(p => {
    if (filterType !== 'ALL' && p.type !== filterType) return;

    // Convert percentage bbox to absolute canvas coordinates
    const [bxPct, byPct, bwPct, bhPct] = p.bbox || [20, 20, 10, 10];
    const x = (bxPct / 100) * w;
    const y = (byPct / 100) * h;
    const bw = (bwPct / 100) * w;
    const bh = (bhPct / 100) * h;

    const isHovered = hoveredParticle && hoveredParticle.id === p.id;
    const isSelected = selectedParticleId === p.id;

    ctx.save();

    // Box outline
    ctx.strokeStyle = p.color || '#38bdf8';
    ctx.lineWidth = isHovered || isSelected ? 3.5 : 2;

    if (isHovered || isSelected) {
      ctx.shadowColor = p.color || '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(x, y, bw, bh);
    }

    ctx.strokeRect(x, y, bw, bh);

    // Bounding Box Label
    if (showLabels) {
      const labelText = `${p.type.toUpperCase()} #${p.id} (${p.size_um || 0}µm)`;
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      const textMetrics = ctx.measureText(labelText);
      const padding = 4;

      // Label background banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(x, Math.max(0, y - 20), textMetrics.width + (padding * 2), 18);

      // Label text
      ctx.fillStyle = p.color || '#38bdf8';
      ctx.fillText(labelText, x + padding, Math.max(14, y - 6));
    }

    ctx.restore();
  });
}

function renderParticleInventory(sample) {
  const tbody = document.getElementById('particleInventoryTbody');
  if (!tbody) return;

  if (!sample.particles || !sample.particles.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No candidate microplastic particles detected in this sample micrograph.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = sample.particles.map(p => {
    const badgeClass = {
      fiber: 'badge-fiber',
      fragment: 'badge-fragment',
      film: 'badge-film',
      bead: 'badge-bead'
    }[p.type] || 'badge-info';

    return `
      <tr style="cursor: pointer;" data-particle-id="${p.id}" class="particle-row">
        <td class="mono" style="font-weight: 700;">#${p.id}</td>
        <td><span class="badge ${badgeClass}">${p.type}</span></td>
        <td class="mono">${p.size_um || '—'} µm</td>
        <td class="mono">${Math.round((p.confidence || 0.85) * 100)}%</td>
        <td style="color: var(--text-secondary); font-size: 0.8rem;">
          ${p.type === 'fiber' ? 'Polyester / Nylon candidate' : p.type === 'fragment' ? 'Polyethylene (PE) / PP candidate' : p.type === 'bead' ? 'Polystyrene (PS) microsphere' : 'Polymer film sheet'}
        </td>
      </tr>
    `;
  }).join('');

  // Row click highlights particle on canvas
  document.querySelectorAll('.particle-row').forEach(row => {
    row.addEventListener('click', () => {
      const pId = parseInt(row.getAttribute('data-particle-id'));
      selectedParticleId = pId;
      drawCanvas();
      showToast(`Selected particle #${pId} on micrograph canvas`, 'info', 2000);
    });

    row.addEventListener('mouseenter', () => {
      const pId = parseInt(row.getAttribute('data-particle-id'));
      hoveredParticle = currentSample.particles.find(p => p.id === pId) || null;
      drawCanvas();
    });

    row.addEventListener('mouseleave', () => {
      hoveredParticle = null;
      drawCanvas();
    });
  });
}

function setupEventListeners() {
  const canvas = document.getElementById('analysisCanvas');
  const tooltip = document.getElementById('particleTooltip');
  const chkBoxes = document.getElementById('chkShowBoxes');
  const chkLabels = document.getElementById('chkShowLabels');
  const filterType = document.getElementById('filterParticleType');
  const btnPrint = document.getElementById('btnPrintReport');
  const btnPrintTop = document.getElementById('btnPrintTop');
  const btnDownloadJson = document.getElementById('btnDownloadReportJson');

  chkBoxes?.addEventListener('change', drawCanvas);
  chkLabels?.addEventListener('change', drawCanvas);
  filterType?.addEventListener('change', drawCanvas);

  // Canvas mouse interaction for tooltips
  if (canvas && tooltip) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      let found = null;
      if (currentSample && currentSample.particles) {
        for (const p of currentSample.particles) {
          const [bxPct, byPct, bwPct, bhPct] = p.bbox || [0, 0, 0, 0];
          const x = (bxPct / 100) * canvas.width;
          const y = (byPct / 100) * canvas.height;
          const bw = (bwPct / 100) * canvas.width;
          const bh = (bhPct / 100) * canvas.height;

          if (mouseX >= x && mouseX <= x + bw && mouseY >= y && mouseY <= y + bh) {
            found = p;
            break;
          }
        }
      }

      hoveredParticle = found;
      drawCanvas();

      if (found) {
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX - rect.left + 15}px`;
        tooltip.style.top = `${e.clientY - rect.top + 15}px`;
        tooltip.innerHTML = `
          <strong style="color:${found.color || '#38bdf8'};">${found.type.toUpperCase()} #${found.id}</strong><br>
          Size: ${found.size_um || '—'} µm<br>
          Confidence: ${Math.round((found.confidence || 0.85) * 100)}%<br>
          <span style="color:var(--text-muted);">Click row in table to lock</span>
        `;
      } else {
        tooltip.style.display = 'none';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      hoveredParticle = null;
      tooltip.style.display = 'none';
      drawCanvas();
    });
  }

  // Print handlers
  const handlePrint = () => {
    window.print();
  };
  btnPrint?.addEventListener('click', handlePrint);
  btnPrintTop?.addEventListener('click', handlePrint);

  // Export JSON Report
  btnDownloadJson?.addEventListener('click', () => {
    if (!currentSample) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentSample, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `microplastics_analysis_${currentSample.id}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast(`Exported ${currentSample.id} report to JSON`, 'success');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAnalysisPage();
});

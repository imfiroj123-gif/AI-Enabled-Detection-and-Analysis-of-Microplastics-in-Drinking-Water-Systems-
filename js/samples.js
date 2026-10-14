/**
 * AI-Enabled Microplastics Detection System
 * Sample Repository Management, CRUD & Pagination
 */

let currentPage = 1;
const PAGE_SIZE = 6;
let sampleToDeleteId = null;

function getFilteredAndSortedSamples() {
  let samples = WaterQualityDB.getSamples();

  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const statusVal = document.getElementById('filterStatus')?.value || 'ALL';
  const sourceVal = document.getElementById('filterSource')?.value || 'ALL';
  const sortVal = document.getElementById('sortBy')?.value || 'date-desc';

  // Filter
  samples = samples.filter(s => {
    const matchesSearch = !searchVal || 
      s.id.toLowerCase().includes(searchVal) || 
      s.location.toLowerCase().includes(searchVal) || 
      (s.notes && s.notes.toLowerCase().includes(searchVal));

    const matchesStatus = statusVal === 'ALL' || s.status === statusVal;
    const matchesSource = sourceVal === 'ALL' || s.sourceType === sourceVal;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Sort
  samples.sort((a, b) => {
    if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortVal === 'particles-desc') return (b.candidateCount || 0) - (a.candidateCount || 0);
    if (sortVal === 'volume-desc') return (b.volume || 0) - (a.volume || 0);
    if (sortVal === 'id-asc') return a.id.localeCompare(b.id);
    return 0;
  });

  return samples;
}

function renderSamplesTable() {
  const tbody = document.getElementById('samplesTableBody');
  const emptyState = document.getElementById('noResultsEmptyState');
  const paginationInfo = document.getElementById('paginationInfo');
  const paginationControls = document.getElementById('paginationControls');
  const totalBadge = document.getElementById('totalRecordsBadge');

  if (!tbody) return;

  const filtered = getFilteredAndSortedSamples();
  const total = filtered.length;

  if (totalBadge) totalBadge.textContent = `${total} Records`;

  if (total === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (paginationInfo) paginationInfo.textContent = 'Showing 0 records';
    if (paginationControls) paginationControls.innerHTML = '';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Calculate pagination bounds
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const pageSamples = filtered.slice(startIdx, endIdx);

  if (paginationInfo) {
    paginationInfo.textContent = `Showing ${startIdx + 1} to ${endIdx} of ${total} records`;
  }

  // Render Table Rows
  tbody.innerHTML = pageSamples.map(s => {
    const statusBadgeClass = {
      'Flagged Particles': 'badge-danger',
      'Non-Detected': 'badge-active',
      'Awaiting Analysis': 'badge-demo'
    }[s.status] || 'badge-info';

    const conc = (s.candidateCount !== null && s.volume > 0) 
      ? (s.candidateCount / s.volume).toFixed(2) 
      : '—';

    return `
      <tr>
        <td class="mono" style="font-weight: 700; color: var(--accent-cyan);">${s.id}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${s.location}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${s.notes ? s.notes.slice(0, 45) + '...' : ''}</div>
        </td>
        <td><span class="badge" style="background: rgba(255,255,255,0.05);">${s.sourceType}</span></td>
        <td class="mono" style="font-size: 0.82rem;">${s.date}</td>
        <td class="mono">${s.volume} L</td>
        <td class="mono" style="font-weight: 700; color: ${s.candidateCount > 0 ? '#f43f5e' : 'inherit'};">
          ${s.candidateCount !== null ? s.candidateCount : '<span class="badge badge-demo">Pending</span>'}
        </td>
        <td class="mono" style="font-size: 0.85rem;">${conc}</td>
        <td><span class="badge ${statusBadgeClass}">${s.status}</span></td>
        <td style="text-align: right; white-space: nowrap;">
          <a href="analysis.html?id=${encodeURIComponent(s.id)}" class="btn btn-outline btn-sm" style="font-size: 0.78rem; padding: 0.3rem 0.6rem;" title="View Optical Analysis">
            Inspect
          </a>
          <button type="button" class="btn btn-secondary btn-sm btn-edit-sample" data-id="${s.id}" style="font-size: 0.78rem; padding: 0.3rem 0.6rem;" title="Edit Metadata">
            Edit
          </button>
          <button type="button" class="btn btn-sm btn-delete-sample" data-id="${s.id}" style="font-size: 0.78rem; padding: 0.3rem 0.6rem; color: var(--accent-red);" title="Delete Record">
            ✕
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Render Pagination Controls
  renderPaginationButtons(totalPages);
  attachRowActionListeners();
}

function renderPaginationButtons(totalPages) {
  const container = document.getElementById('paginationControls');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  html += `<button type="button" class="page-btn" ${currentPage === 1 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} onclick="goToPage(${currentPage - 1})">‹</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button type="button" class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  html += `<button type="button" class="page-btn" ${currentPage === totalPages ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} onclick="goToPage(${currentPage + 1})">›</button>`;

  container.innerHTML = html;
}

window.goToPage = function(page) {
  currentPage = page;
  renderSamplesTable();
};

function attachRowActionListeners() {
  // Edit buttons
  document.querySelectorAll('.btn-edit-sample').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const sample = WaterQualityDB.getSampleById(id);
      if (sample) {
        document.getElementById('editSampleId').value = sample.id;
        document.getElementById('editSampleIdDisplay').value = sample.id;
        document.getElementById('editLocation').value = sample.location;
        document.getElementById('editSourceType').value = sample.sourceType;
        document.getElementById('editVolume').value = sample.volume;
        document.getElementById('editNotes').value = sample.notes || '';
        openModal('editModal');
      }
    });
  });

  // Delete buttons
  document.querySelectorAll('.btn-delete-sample').forEach(btn => {
    btn.addEventListener('click', () => {
      sampleToDeleteId = btn.getAttribute('data-id');
      document.getElementById('deleteSampleIdText').textContent = sampleToDeleteId;
      openModal('deleteModal');
    });
  });
}

function initSampleRepository() {
  renderSamplesTable();

  // Search & Filter event listeners
  document.getElementById('searchInput')?.addEventListener('input', () => {
    currentPage = 1;
    renderSamplesTable();
  });

  document.getElementById('filterStatus')?.addEventListener('change', () => {
    currentPage = 1;
    renderSamplesTable();
  });

  document.getElementById('filterSource')?.addEventListener('change', () => {
    currentPage = 1;
    renderSamplesTable();
  });

  document.getElementById('sortBy')?.addEventListener('change', () => {
    renderSamplesTable();
  });

  // Column header sorting
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const sortKey = th.getAttribute('data-sort');
      const select = document.getElementById('sortBy');
      if (select) {
        if (sortKey === 'date') select.value = select.value === 'date-desc' ? 'date-asc' : 'date-desc';
        else if (sortKey === 'particles') select.value = 'particles-desc';
        else if (sortKey === 'volume') select.value = 'volume-desc';
        else if (sortKey === 'id') select.value = 'id-asc';
        renderSamplesTable();
      }
    });
  });

  // Export CSV
  document.getElementById('btnExportSamplesCSV')?.addEventListener('click', () => {
    WaterQualityDB.exportCSV();
  });

  // Reset Demo Data
  document.getElementById('btnResetRepoDemo')?.addEventListener('click', () => {
    if (confirm('Reset sample repository to peer-reviewed demo baseline?')) {
      WaterQualityDB.resetDemoData();
      currentPage = 1;
      renderSamplesTable();
      showToast('Sample repository reset to default state', 'success');
    }
  });

  // Edit Form Submit
  document.getElementById('editSampleForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('editSampleId').value;
    const updated = {
      location: document.getElementById('editLocation').value.trim(),
      sourceType: document.getElementById('editSourceType').value,
      volume: parseFloat(document.getElementById('editVolume').value) || 1.0,
      notes: document.getElementById('editNotes').value.trim()
    };

    WaterQualityDB.updateSample(id, updated);
    closeModal('editModal');
    renderSamplesTable();
    showToast(`Sample ${id} updated successfully`, 'success');
  });

  // Delete Confirm Button
  document.getElementById('btnConfirmDelete')?.addEventListener('click', () => {
    if (sampleToDeleteId) {
      WaterQualityDB.deleteSample(sampleToDeleteId);
      closeModal('deleteModal');
      renderSamplesTable();
      showToast(`Sample ${sampleToDeleteId} deleted from database`, 'info');
      sampleToDeleteId = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSampleRepository();
});

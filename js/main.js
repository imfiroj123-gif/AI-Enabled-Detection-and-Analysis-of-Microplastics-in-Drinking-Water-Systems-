/**
 * AI-Enabled Microplastics Detection System
 * Core Shared Library & Local Storage State Management
 */

// ==========================================================================
// Theme Management (Light / Dark Mode)
// ==========================================================================
const ThemeManager = {
  STORAGE_KEY: 'microplastics_theme',

  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || 'dark';
    this.setTheme(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateToggleIcons(theme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    showToast(`Switched to ${next} mode`, 'info');
  },

  updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
      btn.setAttribute('aria-label', `Toggle Theme`);
    });
  }
};

// ==========================================================================
// Toast Notification System
// ==========================================================================
function showToast(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }[type] || '';

  toast.innerHTML = `
    <div style="flex-shrink:0;">${iconSvg}</div>
    <div style="flex-grow:1; line-height:1.4;">${message}</div>
    <button type="button" aria-label="Close notification" style="color:var(--text-muted); padding:0 0 0 0.5rem;" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ==========================================================================
// Modal Window Helpers
// ==========================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ==========================================================================
// Centralized Database & localStorage Manager
// ==========================================================================
const WaterQualityDB = {
  STORAGE_KEY: 'microplastic_samples_db_v1',

  // Pre-configured peer-reviewed style demo dataset
  DEFAULT_SAMPLES: [
    {
      id: 'MP-2026-081',
      location: 'Central Municipal Water Treatment Plant - Effluent Basin',
      sourceType: 'Treated Drinking Water',
      date: '2026-10-12',
      volume: 5.0,
      meshSize: '20 µm',
      status: 'Flagged Particles',
      candidateCount: 14,
      particles: [
        { id: 1, type: 'fiber', size_um: 342, confidence: 0.94, bbox: [18, 22, 60, 45], color: '#38bdf8' },
        { id: 2, type: 'fragment', size_um: 88, confidence: 0.89, bbox: [20, 36, 12, 10], color: '#f43f5e' },
        { id: 3, type: 'fragment', size_um: 72, confidence: 0.91, bbox: [31, 33, 10, 12], color: '#f43f5e' },
        { id: 4, type: 'fragment', size_um: 95, confidence: 0.87, bbox: [38, 22, 10, 8], color: '#f43f5e' },
        { id: 5, type: 'fragment', size_um: 64, confidence: 0.85, bbox: [55, 11, 8, 7], color: '#f43f5e' },
        { id: 6, type: 'bead', size_um: 28, confidence: 0.96, bbox: [60, 58, 5, 5], color: '#eab308' },
        { id: 7, type: 'bead', size_um: 26, confidence: 0.95, bbox: [64, 58, 5, 5], color: '#eab308' },
        { id: 8, type: 'bead', size_um: 30, confidence: 0.92, bbox: [68, 60, 5, 5], color: '#eab308' },
        { id: 9, type: 'bead', size_um: 27, confidence: 0.94, bbox: [65, 63, 5, 5], color: '#eab308' },
        { id: 10, type: 'bead', size_um: 29, confidence: 0.93, bbox: [69, 68, 5, 5], color: '#eab308' },
        { id: 11, type: 'bead', size_um: 28, confidence: 0.95, bbox: [70, 71, 5, 5], color: '#eab308' },
        { id: 12, type: 'fragment', size_um: 58, confidence: 0.86, bbox: [58, 85, 7, 7], color: '#f43f5e' },
        { id: 13, type: 'fragment', size_um: 61, confidence: 0.88, bbox: [62, 86, 6, 6], color: '#f43f5e' },
        { id: 14, type: 'film', size_um: 110, confidence: 0.82, bbox: [30, 67, 10, 13], color: '#10b981' }
      ],
      notes: 'Prominent synthetic blue fiber and cluster of spherical polymer beads detected on nitrocellulose grid.',
      image: 'assets/images/sample_microscope_slide.jpg',
      createdAt: '2026-10-12T09:30:00Z'
    },
    {
      id: 'MP-2026-082',
      location: 'Highland Reservoir Intake Channel - Station A',
      sourceType: 'Raw Reservoir Intake',
      date: '2026-10-11',
      volume: 10.0,
      meshSize: '50 µm',
      status: 'Flagged Particles',
      candidateCount: 22,
      particles: [
        { id: 1, type: 'fiber', size_um: 480, confidence: 0.96, bbox: [25, 20, 50, 40], color: '#38bdf8' },
        { id: 2, type: 'film', size_um: 210, confidence: 0.88, bbox: [45, 60, 20, 15], color: '#10b981' },
        { id: 3, type: 'fragment', size_um: 145, confidence: 0.90, bbox: [15, 65, 12, 12], color: '#f43f5e' }
      ],
      notes: 'Sample exhibited surface runoff sediments and secondary plastic degradation fragments.',
      image: 'assets/images/sample_microscope_slide.jpg',
      createdAt: '2026-10-11T14:15:00Z'
    },
    {
      id: 'MP-2026-083',
      location: 'Metro District 4 - Final Residential Tap Point',
      sourceType: 'Finished Tap Water',
      date: '2026-10-10',
      volume: 2.0,
      meshSize: '20 µm',
      status: 'Non-Detected',
      candidateCount: 0,
      particles: [],
      notes: 'Zero candidate particles detected within calibrated 10-5000 µm range. Background mineral baseline normal.',
      image: 'assets/images/hero_microplastic.jpg',
      createdAt: '2026-10-10T11:00:00Z'
    },
    {
      id: 'MP-2026-084',
      location: 'Industrial Commercial Bottling Line 2',
      sourceType: 'Bottled Spring Water',
      date: '2026-10-09',
      volume: 1.5,
      meshSize: '10 µm',
      status: 'Flagged Particles',
      candidateCount: 5,
      particles: [
        { id: 1, type: 'bead', size_um: 18, confidence: 0.92, bbox: [40, 40, 8, 8], color: '#eab308' },
        { id: 2, type: 'fiber', size_um: 195, confidence: 0.87, bbox: [20, 30, 30, 20], color: '#38bdf8' }
      ],
      notes: 'Trace polyethylene terephthalate (PET) candidate micro-particles noted near container neck seal.',
      image: 'assets/images/sample_microscope_slide.jpg',
      createdAt: '2026-10-09T16:45:00Z'
    },
    {
      id: 'MP-2026-085',
      location: 'Pine Creek Watershed - Upstream Spring Filter',
      sourceType: 'Raw Reservoir Intake',
      date: '2026-10-08',
      volume: 8.0,
      meshSize: '50 µm',
      status: 'Awaiting Analysis',
      candidateCount: null,
      particles: [],
      notes: 'Freshly concentrated sample awaiting secondary fluorescence screening and optical verification.',
      image: 'assets/images/sample_microscope_slide.jpg',
      createdAt: '2026-10-08T08:20:00Z'
    }
  ],

  getSamples() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      this.resetDemoData();
      return this.DEFAULT_SAMPLES;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing samples from localStorage:', e);
      return this.DEFAULT_SAMPLES;
    }
  },

  getSampleById(id) {
    const samples = this.getSamples();
    return samples.find(s => s.id === id) || null;
  },

  saveSample(sample) {
    const samples = this.getSamples();
    const existingIndex = samples.findIndex(s => s.id === sample.id);
    if (existingIndex >= 0) {
      samples[existingIndex] = sample;
    } else {
      samples.unshift(sample);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(samples));
    return sample;
  },

  updateSample(id, updatedFields) {
    const samples = this.getSamples();
    const index = samples.findIndex(s => s.id === id);
    if (index >= 0) {
      samples[index] = { ...samples[index], ...updatedFields };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(samples));
      return samples[index];
    }
    return null;
  },

  deleteSample(id) {
    let samples = this.getSamples();
    samples = samples.filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(samples));
  },

  resetDemoData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.DEFAULT_SAMPLES));
    return this.DEFAULT_SAMPLES;
  },

  exportCSV() {
    const samples = this.getSamples();
    if (!samples.length) {
      showToast('No sample records to export.', 'warning');
      return;
    }

    const headers = [
      'Sample ID',
      'Location',
      'Source Type',
      'Collection Date',
      'Volume (L)',
      'Mesh Size',
      'Status',
      'Candidate Particles',
      'Concentration (part/L)',
      'Notes'
    ];

    const rows = samples.map(s => {
      const conc = (s.candidateCount !== null && s.volume > 0) 
        ? (s.candidateCount / s.volume).toFixed(2) 
        : 'N/A';
      return [
        `"${s.id}"`,
        `"${s.location.replace(/"/g, '""')}"`,
        `"${s.sourceType}"`,
        `"${s.date}"`,
        s.volume,
        `"${s.meshSize}"`,
        `"${s.status}"`,
        s.candidateCount !== null ? s.candidateCount : 'Pending',
        conc,
        `"${(s.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `microplastic_water_samples_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Sample dataset exported to CSV successfully', 'success');
  }
};

// ==========================================================================
// Mobile Navigation Drawer Toggle & Active Links
// ==========================================================================
function initNavigation() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // Active link highlighters
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .sidebar-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initNavigation();
});

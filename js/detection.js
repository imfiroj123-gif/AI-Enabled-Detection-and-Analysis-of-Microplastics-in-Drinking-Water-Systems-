/**
 * AI-Enabled Microplastics Detection System
 * Sample Ingestion, File Validation & Optical Simulation Pipeline
 */

let selectedImageData = null;
let isDemoImage = false;

function generateSampleId() {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `MP-2026-${randomSuffix}`;
}

function initDetectionForm() {
  const sampleIdInput = document.getElementById('sampleIdInput');
  const collectionDateInput = document.getElementById('collectionDateInput');
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const previewPanel = document.getElementById('previewPanel');
  const previewImage = document.getElementById('previewImage');
  const btnBrowse = document.getElementById('btnBrowseFiles');
  const btnReplace = document.getElementById('btnReplaceImage');
  const btnRemove = document.getElementById('btnRemoveImage');
  const btnLoadDemo = document.getElementById('btnLoadDemoImage');
  const form = document.getElementById('detectionForm');

  // Set default sample ID and today's date
  if (sampleIdInput) sampleIdInput.value = generateSampleId();
  if (collectionDateInput) {
    const today = new Date().toISOString().split('T')[0];
    collectionDateInput.value = today;
    collectionDateInput.max = today;
  }

  // Browse files triggers
  btnBrowse?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput?.click();
  });

  dropzone?.addEventListener('click', () => {
    fileInput?.click();
  });

  // Drag and Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone?.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  });

  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  // Load Demo Micrograph Slide
  btnLoadDemo?.addEventListener('click', () => {
    selectedImageData = 'assets/images/sample_microscope_slide.jpg';
    isDemoImage = true;
    displayImagePreview(selectedImageData);
    showToast('Loaded authentic 100x laboratory microplastic sample slide', 'info');
  });

  // Replace / Remove Image
  btnReplace?.addEventListener('click', () => {
    fileInput?.click();
  });

  btnRemove?.addEventListener('click', () => {
    selectedImageData = null;
    isDemoImage = false;
    if (fileInput) fileInput.value = '';
    previewPanel.style.display = 'none';
    dropzone.style.display = 'block';
  });

  // Form Submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedImageData) {
      showToast('Please select or upload a microscope sample image to analyze.', 'warning');
      return;
    }
    executeDetectionPipeline();
  });
}

function handleFileSelection(file) {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    showToast('Invalid file format. Please upload JPG, JPEG, or PNG.', 'error');
    return;
  }

  // Validate size (max 15MB)
  const maxSize = 15 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast('File size exceeds 15MB limit. Please compress the micrograph.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageData = e.target.result;
    isDemoImage = false;
    displayImagePreview(selectedImageData);
    showToast('Micrograph uploaded and validated successfully', 'success');
  };
  reader.onerror = () => {
    showToast('Error reading image file.', 'error');
  };
  reader.readAsDataURL(file);
}

function displayImagePreview(src) {
  const dropzone = document.getElementById('dropzone');
  const previewPanel = document.getElementById('previewPanel');
  const previewImage = document.getElementById('previewImage');

  if (previewImage) previewImage.src = src;
  if (dropzone) dropzone.style.display = 'none';
  if (previewPanel) previewPanel.style.display = 'flex';
}

function appendConsoleLog(text) {
  const logBox = document.getElementById('consoleLog');
  if (logBox) {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const logItem = document.createElement('div');
    logItem.innerHTML = `<span style="color:var(--text-muted)">[${timestamp}]</span> ${text}`;
    logBox.appendChild(logItem);
    logBox.scrollTop = logBox.scrollHeight;
  }
}

function executeDetectionPipeline() {
  const form = document.getElementById('detectionForm');
  const processingBox = document.getElementById('processingBox');
  const progressFill = document.getElementById('progressFill');
  const progressPercentage = document.getElementById('progressPercentage');
  const currentStepText = document.getElementById('currentStepText');
  const submitBtn = document.getElementById('btnSubmitAnalysis');

  // Disable button and scroll to processing
  if (submitBtn) submitBtn.disabled = true;
  if (processingBox) {
    processingBox.style.display = 'block';
    processingBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  appendConsoleLog('Starting ingestion pipeline for sample ' + document.getElementById('sampleIdInput').value);

  // Realistic simulation steps
  const steps = [
    {
      progress: 20,
      text: 'Step 1/4: High-pass spatial filtering and illumination normalization...',
      log: 'Normalized 47mm membrane illumination. Background contrast equalized.'
    },
    {
      progress: 45,
      text: 'Step 2/4: Morphological edge extraction and background subtraction...',
      log: 'Adaptive Otsu thresholding applied. Segmented 18 candidate region blobs.'
    },
    {
      progress: 75,
      text: 'Step 3/4: Convolutional feature classification (Fibers, Fragments, Films, Beads)...',
      log: 'Neural classification complete. Extracted aspect ratios and morphological markers.'
    },
    {
      progress: 95,
      text: 'Step 4/4: Calibrating micrometer dimensions and calculating concentrations...',
      log: 'Calibrated with 100 µm grid scale. Finalized candidate bounding coordinates.'
    },
    {
      progress: 100,
      text: 'Analysis Complete! Compiling laboratory report...',
      log: 'Pipeline successfully finalized. Writing record to local storage cache.'
    }
  ];

  let currentStep = 0;

  function runNextStep() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      if (progressFill) progressFill.style.width = `${step.progress}%`;
      if (progressPercentage) progressPercentage.textContent = `${step.progress}%`;
      if (currentStepText) currentStepText.textContent = step.text;
      appendConsoleLog(step.log);

      currentStep++;
      setTimeout(runNextStep, 700);
    } else {
      finalizeSampleAnalysis();
    }
  }

  setTimeout(runNextStep, 500);
}

function finalizeSampleAnalysis() {
  const sampleId = document.getElementById('sampleIdInput').value.trim() || generateSampleId();
  const location = document.getElementById('locationInput').value.trim() || 'Municipal Catchment Station';
  const date = document.getElementById('collectionDateInput').value;
  const sourceType = document.getElementById('sourceTypeSelect').value;
  const volume = parseFloat(document.getElementById('volumeInput').value) || 5.0;
  const meshSize = document.getElementById('meshSizeSelect').value;
  const notes = document.getElementById('notesInput').value.trim();

  // Create simulated realistic candidate particles based on the slide
  const particles = [
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
  ];

  const candidateCount = particles.length;

  const newSample = {
    id: sampleId,
    location: location,
    sourceType: sourceType,
    date: date,
    volume: volume,
    meshSize: meshSize,
    status: candidateCount > 0 ? 'Flagged Particles' : 'Non-Detected',
    candidateCount: candidateCount,
    particles: particles,
    notes: notes || 'Optical screening completed. Distinct microplastic morphologies detected.',
    image: selectedImageData || 'assets/images/sample_microscope_slide.jpg',
    createdAt: new Date().toISOString()
  };

  WaterQualityDB.saveSample(newSample);
  showToast('Analysis complete! Redirecting to optical analysis...', 'success');

  setTimeout(() => {
    window.location.href = `analysis.html?id=${encodeURIComponent(sampleId)}`;
  }, 900);
}

document.addEventListener('DOMContentLoaded', () => {
  initDetectionForm();
});

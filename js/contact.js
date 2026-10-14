/**
 * AI-Enabled Microplastics Detection System
 * Contact Form Client-side Validation & Transparent Demo Logging
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const subjectInput = document.getElementById('contactSubject');
  const orgInput = document.getElementById('contactOrg');
  const charCount = document.getElementById('charCount');
  const successCard = document.getElementById('contactSuccessCard');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Real-time character count
  messageInput?.addEventListener('input', () => {
    const len = messageInput.value.length;
    if (charCount) {
      charCount.textContent = `${len} / 20 min`;
      charCount.style.color = len >= 20 ? 'var(--accent-green)' : 'var(--text-muted)';
    }
  });

  // Simple email regex
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.style.display = 'block';
      nameInput.style.borderColor = 'var(--accent-red)';
      isValid = false;
    } else {
      nameError.style.display = 'none';
      nameInput.style.borderColor = '';
    }

    // Validate Email
    if (!isValidEmail(emailInput.value.trim())) {
      emailError.style.display = 'block';
      emailInput.style.borderColor = 'var(--accent-red)';
      isValid = false;
    } else {
      emailError.style.display = 'none';
      emailInput.style.borderColor = '';
    }

    // Validate Message length (min 20 chars)
    if (messageInput.value.trim().length < 20) {
      messageError.style.display = 'block';
      messageInput.style.borderColor = 'var(--accent-red)';
      isValid = false;
    } else {
      messageError.style.display = 'none';
      messageInput.style.borderColor = '';
    }

    if (!isValid) {
      showToast('Please correct the highlighted validation errors.', 'error');
      return;
    }

    // Log payload to browser console with transparent demo explanation
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      institution: orgInput?.value.trim() || 'N/A',
      subject: subjectInput.value,
      message: messageInput.value.trim(),
      submittedAt: new Date().toISOString(),
      mode: 'DEMO_MODE_CLIENT_ONLY'
    };

    console.info('[AquaNanoAI Contact Inquiry Payload]', payload);

    if (successCard) {
      successCard.style.display = 'block';
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast('Inquiry validated and logged to console (Demo Mode)', 'success');
    form.reset();
    if (charCount) charCount.textContent = '0 / 20 min';
  });
});

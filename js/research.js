/**
 * AI-Enabled Microplastics Detection System
 * Research Page TOC Highlighting & Interactive Reference Behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function highlightTOC() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--accent-cyan)';
            link.style.fontWeight = '700';
          } else {
            link.style.color = 'var(--text-secondary)';
            link.style.fontWeight = 'normal';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightTOC);
  highlightTOC();
});

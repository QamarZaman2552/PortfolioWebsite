(() => {
  'use strict';

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><button class="lightbox-arrow prev" aria-label="Previous">&#8249;</button><img src="" alt="Gallery image"><button class="lightbox-arrow next" aria-label="Next">&#8250;</button>';
  document.body.appendChild(lightbox);

  let currentGallery = [];
  let currentIndex = 0;

  function showLightbox(images, index) {
    currentGallery = images;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    lightbox.querySelector('img').src = currentGallery[currentIndex];
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentGallery.length; updateLightbox(); }
  });
  lightbox.querySelector('.lightbox-arrow.prev').addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateLightbox(); });
  lightbox.querySelector('.lightbox-arrow.next').addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentGallery.length; updateLightbox(); });

  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const images = [...gallery.querySelectorAll('img')].map(img => img.src);
    gallery.querySelectorAll('img').forEach((img, i) => {
      img.addEventListener('click', () => showLightbox(images, i));
    });
  });

  const config = window.SMARTSFLOW_CONTACT || {};
  for (const platform of ['linkedin', 'facebook', 'github', 'whatsapp']) {
    const url = config[platform];
    if (!url) continue;
    let parsed;
    try { parsed = new URL(url); } catch { continue; }
    if (parsed.protocol !== 'https:') continue;
    document.querySelectorAll(`[data-social="${platform}"]`).forEach(link => {
      link.href = parsed.href;
    });
  }
  const email = config.email || 'qamar.zaman@email.com';
  document.querySelectorAll('[data-social="gmail"]').forEach(link => {
    link.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email);
  });
  document.querySelectorAll('.social-email').forEach(label => { label.textContent = email; });
  document.querySelectorAll('.contact-info-val').forEach(el => {
    if (el.textContent.includes('@')) {
      const a = document.createElement('a'); a.href = 'mailto:' + email; a.textContent = email; a.style.color = 'inherit'; el.replaceChildren(a);
    }
  });
  let lastFocused;
  const dialog = document.createElement('dialog');
  dialog.className = 'proof-dialog';
  dialog.setAttribute('aria-labelledby', 'proof-dialog-title');
  dialog.innerHTML = '<div class="proof-dialog-head"><h2 id="proof-dialog-title">Project image</h2><button class="proof-close" type="button" autofocus>Close ×</button></div><div class="proof-dialog-media"><img alt=""></div>';
  document.body.append(dialog);
  const enlarged = dialog.querySelector('img');
  document.querySelectorAll('[data-proof]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || typeof dialog.showModal !== 'function') return;
      event.preventDefault(); lastFocused = link;
      const img = link.querySelector('img'); enlarged.src = link.href; enlarged.alt = img.alt;
      enlarged.classList.toggle('tall', img.naturalHeight > img.naturalWidth);
      dialog.querySelector('h2').textContent = img.alt;
      dialog.showModal(); document.body.style.overflow = 'hidden';
      dialog.querySelector('.proof-dialog-media').scrollTop = 0;
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; lastFocused?.focus(); });
  const mobile = document.getElementById('mobileNav');
  if (mobile) {
    const sync = () => document.querySelector('.hamburger')?.setAttribute('aria-expanded', String(mobile.classList.contains('open')));
    new MutationObserver(sync).observe(mobile, {attributes:true, attributeFilter:['class']});
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobile.classList.contains('open')) { window.closeMobileNav?.(); document.querySelector('.hamburger')?.focus(); } });
  }
  window.handleSubmit = () => {
    const fields = [...document.querySelectorAll('.contact-form input,.contact-form select,.contact-form textarea')];
    if (!fields.every(field => field.reportValidity())) return;
    const labels = ['Name', 'Email', 'Business type', 'Service', 'Website', 'Goal'];
    const body = fields.map((field, index) => labels[index] + ': ' + field.value).join('\n\n');
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Project enquiry — Qamar Zaman') + '&body=' + encodeURIComponent(body);
    document.getElementById('form-status').textContent = 'Your email app has been requested. Review the draft and press Send. If it does not open, use the Gmail card or email ' + email + ' directly.';
  };
})();

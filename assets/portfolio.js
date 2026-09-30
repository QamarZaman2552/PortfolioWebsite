(() => {
  'use strict';

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><button class="lightbox-arrow prev" aria-label="Previous">&#8249;</button><img src="" alt="Gallery image"><button class="lightbox-arrow next" aria-label="Next">&#8250;</button><div class="lightbox-counter" aria-live="polite"></div>';
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
    lightbox.querySelector('.lightbox-counter').textContent = (currentIndex + 1) + ' / ' + currentGallery.length;
    const multi = currentGallery.length > 1;
    lightbox.querySelector('.lightbox-arrow.prev').style.display = multi ? '' : 'none';
    lightbox.querySelector('.lightbox-arrow.next').style.display = multi ? '' : 'none';
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
      img.addEventListener('click', e => { e.stopPropagation(); showLightbox(images, i); });
    });
    if (images.length > 3) {
      const badge = document.createElement('span');
      badge.className = 'gallery-more';
      badge.textContent = '+' + (images.length - 3);
      gallery.appendChild(badge);
    }
  });

  const resumeBtn = document.getElementById('resumeBtn');
  const resumeMenu = document.getElementById('resumeMenu');
  if (resumeBtn && resumeMenu) {
    resumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resumeMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!resumeMenu.contains(e.target) && e.target !== resumeBtn) {
        resumeMenu.classList.remove('open');
      }
    });
  }

  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  });

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const cats = card.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) card.classList.remove('hidden');
        else card.classList.add('hidden');
      });
    });
  });

  const heroTitle = document.querySelector('.hero-title');
  const typingEl = document.querySelector('.typing-text');
  const typeText = "I\'m a Full-Stack .NET Developer.";
  let charIndex = 0;
  function typeWriter() {
    if (charIndex < typeText.length) {
      typingEl.textContent += typeText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 80);
    }
  }
  setTimeout(typeWriter, 1000);

  const eduTypingEl = document.querySelector('#education .typing-text');
  const eduText = "Education University of Lahore, Multan Campus";
  let eduCharIndex = 0;
  let eduTyped = false;
  function eduTypeWriter() {
    if (eduCharIndex < eduText.length) {
      eduTypingEl.textContent += eduText.charAt(eduCharIndex);
      eduCharIndex++;
      setTimeout(eduTypeWriter, 60);
    }
  }
  const eduObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !eduTyped) {
        eduTyped = true;
        eduTypeWriter();
        eduObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (eduTypingEl) eduObserver.observe(eduTypingEl);

  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    const cardGithubLink = card.querySelector('.project-github-link');
    if (cardGithubLink) cardGithubLink.addEventListener('click', e => e.stopPropagation());
    card.addEventListener('click', () => {
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      const tags = card.querySelectorAll('.project-tag');
      const githubLink = card.querySelector('.project-github-link');
      const modal = document.getElementById('projectModal');
      const modalTitle = modal.querySelector('.modal-title');
      const modalDesc = modal.querySelector('.modal-desc');
      const modalTags = modal.querySelector('.modal-tags');
      const modalGithub = modal.querySelector('.modal-github');
      modalTitle.textContent = title.textContent;
      modalDesc.textContent = desc.textContent;
      modalTags.innerHTML = '';
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'modal-tag';
        span.textContent = tag.textContent;
        modalTags.appendChild(span);
      });
      modalGithub.href = githubLink ? githubLink.href : '#';
      modalGithub.style.display = githubLink ? '' : 'none';
      const modalLive = modal.querySelector('.modal-live');
      const liveLink = card.querySelector('.project-live-link');
      if (liveLink) { modalLive.href = liveLink.href; modalLive.style.display = ''; }
      else modalLive.style.display = 'none';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = '';
  });
  document.getElementById('projectModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('projectModal');
      if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
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

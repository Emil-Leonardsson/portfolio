// Karusell + lightbox, fungerar för alla element med klassen ".gallery"
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('lightbox-overlay');
  const overlayImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const overlayPrev = overlay.querySelector('.lightbox-prev');
  const overlayNext = overlay.querySelector('.lightbox-next');

  let activeImages = [];
  let activeIndex = 0;

  function openLightbox(images, index){
    activeImages = images;
    activeIndex = index;
    overlayImg.src = activeImages[activeIndex].src;
    overlayImg.alt = activeImages[activeIndex].alt;
    overlay.classList.add('open');
  }
  function closeLightbox(){
    overlay.classList.remove('open');
  }
  function showLightboxDelta(delta){
    activeIndex = (activeIndex + delta + activeImages.length) % activeImages.length;
    overlayImg.src = activeImages[activeIndex].src;
    overlayImg.alt = activeImages[activeIndex].alt;
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
  overlayPrev.addEventListener('click', () => showLightboxDelta(-1));
  overlayNext.addEventListener('click', () => showLightboxDelta(1));
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxDelta(-1);
    if (e.key === 'ArrowRight') showLightboxDelta(1);
  });

  document.querySelectorAll('.gallery').forEach(gallery => {
    const images = Array.from(gallery.querySelectorAll('img'));
    const dots = Array.from(gallery.querySelectorAll('.gallery-dots span'));
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    let current = 0;

    function show(index){
      current = (index + images.length) % images.length;
      images.forEach((img, i) => img.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.stopPropagation(); show(i); }));

    images.forEach(img => {
      img.addEventListener('click', () => openLightbox(images, current));
    });
  });
});

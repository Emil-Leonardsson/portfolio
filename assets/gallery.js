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

  // Läshörnan: sidbläddring för "Lästa"-listan
  document.querySelectorAll('.read-col').forEach(col => {
    const pages = Array.from(col.querySelectorAll('.book-page'));
    if (pages.length === 0) return;
    const dots = Array.from(col.querySelectorAll('.book-dots span'));
    const prevBtn = col.querySelector('.book-prev');
    const nextBtn = col.querySelector('.book-next');
    let current = 0;

    function show(index){
      current = (index + pages.length) % pages.length;
      pages.forEach((page, i) => page.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
    if (prevBtn) prevBtn.addEventListener('click', () => show(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  });

  // Burgermeny för mobil
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burgerBtn.classList.toggle('open', isOpen);
      burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burgerBtn.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

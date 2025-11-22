document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(res => res.text())
    .then(html => {
      document.querySelectorAll('.header-placeholder').forEach(el => {
        el.innerHTML = html;
        const header = el.querySelector('header');
        if (header) {
          let enterTimeout;
          header.addEventListener('pointerenter', () => {
            enterTimeout = setTimeout(() => header.classList.add('hovered'), 100);
          });
          header.addEventListener('pointerleave', () => {
            clearTimeout(enterTimeout);
            header.classList.remove('hovered');
          });
        }
      });
    })
    .catch(console.error);


  // Load footer
  fetch('footer.html')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch footer.html: ' + res.status);
      return res.text();
    })
    .then(html => {
      document.querySelectorAll('.footer-placeholder').forEach(el => {
        el.innerHTML = html;
      });
    })
    .catch(console.error);
});
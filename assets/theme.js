document.addEventListener('DOMContentLoaded', function() {

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('SiteHeader');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('MenuToggle');
  const headerNav = document.getElementById('HeaderNav');
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      headerNav.classList.toggle('open');
      document.body.style.overflow = headerNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    headerNav.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          menuToggle.classList.remove('active');
          headerNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // ===== QUANTITY SELECTORS =====
  document.querySelectorAll('.qty-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('.qty-input');
      if (!input) return;
      let val = parseInt(input.value) || 1;
      if (this.classList.contains('plus')) {
        val++;
      } else if (this.classList.contains('minus') && val > 1) {
        val--;
      }
      input.value = val;
      input.dispatchEvent(new Event('change'));
    });
  });

  // ===== PRODUCT IMAGE GALLERY =====
  const mainImage = document.getElementById('ProductImage');
  document.querySelectorAll('.thumbnail').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      if (mainImage) {
        mainImage.style.opacity = '0';
        setTimeout(function() {
          mainImage.src = thumb.dataset.image;
          mainImage.style.opacity = '1';
        }, 200);
      }
    });
  });

  // ===== CART ITEM REMOVE =====
  document.querySelectorAll('.cart-item-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const variantId = this.dataset.variantId;
      const cartItem = this.closest('.cart-item');
      
      // Add remove animation
      if (cartItem) {
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(-20px)';
        cartItem.style.transition = 'all 0.3s ease';
      }

      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 0 })
      })
      .then(function(res) { return res.json(); })
      .then(function() {
        window.location.reload();
      });
    });
  });

  // ===== CART COUNT UPDATE =====
  function updateCartCount() {
    fetch('/cart.js')
      .then(function(res) { return res.json(); })
      .then(function(cart) {
        const countEl = document.getElementById('CartCount');
        if (countEl) {
          const oldCount = parseInt(countEl.textContent) || 0;
          const newCount = cart.item_count;
          
          if (oldCount !== newCount) {
            countEl.style.transform = 'scale(1.3)';
            setTimeout(function() {
              countEl.textContent = newCount;
              countEl.style.transform = 'scale(1)';
            }, 150);
          }
        }
      });
  }

  updateCartCount();

  // ===== COLLECTION SORTING =====
  const sortSelect = document.getElementById('SortBy');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const url = new URL(window.location);
      url.searchParams.set('sort_by', this.value);
      window.location = url;
    });
  }

  // ===== SEARCH EXPAND =====
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    searchInput.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
  backToTop.setAttribute('aria-label', 'Voltar ao topo');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SCROLL REVEAL ANIMATION =====
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(function(element) {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 150;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('revealed');
      }
    });
  }

  // Add reveal class to sections
  document.querySelectorAll('.featured-products-section, .categories-section, .trust-section, .newsletter-section, .banner-secondary').forEach(function(section) {
    const children = section.querySelectorAll('.section-header, .product-grid, .categories-grid, .trust-grid, .newsletter-content, .banner-secondary-grid, .section-footer');
    children.forEach(function(child, index) {
      child.classList.add('reveal');
      child.style.transitionDelay = (index * 0.1) + 's';
    });
  });

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // ===== PRODUCT FORM - ADD TO CART =====
  const productForm = document.getElementById('ProductForm');
  if (productForm) {
    productForm.addEventListener('submit', function(e) {
      const btn = this.querySelector('.btn-add-to-cart');
      if (btn) {
        btn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> A adicionar...';
        btn.disabled = true;
        btn.style.opacity = '0.8';
      }
    });
  }

  // ===== QUICK VIEW BUTTONS =====
  document.querySelectorAll('.quick-view-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const productUrl = this.dataset.productUrl;
      if (productUrl) {
        window.location.href = productUrl;
      }
    });
  });

  // ===== IMAGE LAZY LOADING =====
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ===== STAGGER ANIMATION FOR PRODUCT CARDS =====
  document.querySelectorAll('.product-grid').forEach(function(grid) {
    grid.querySelectorAll('.product-card').forEach(function(card, index) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transitionDelay = (index * 0.05) + 's';
      
      setTimeout(function() {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    });
  });

});
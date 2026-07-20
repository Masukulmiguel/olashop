document.addEventListener('DOMContentLoaded', function() {

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('MenuToggle');
  const headerNav = document.getElementById('HeaderNav');
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function() {
      headerNav.classList.toggle('open');
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
        mainImage.src = this.dataset.image;
      }
    });
  });

  // ===== CART ITEM REMOVE =====
  document.querySelectorAll('.cart-item-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const variantId = this.dataset.variantId;
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
          countEl.textContent = cart.item_count;
        }
      });
  }

  // Update cart count on page load
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
      this.style.width = '250px';
    });
    searchInput.addEventListener('blur', function() {
      if (!this.value) {
        this.style.width = '200px';
      }
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== PRODUCT FORM - ADD TO CART =====
  const productForm = document.getElementById('ProductForm');
  if (productForm) {
    productForm.addEventListener('submit', function(e) {
      const btn = this.querySelector('.btn-add-to-cart');
      if (btn) {
        btn.textContent = 'A adicionar...';
        btn.disabled = true;
      }
    });
  }
});

// Cart Management System
class CartManager {
  constructor() {
    this.cartItems = [
      { id: 1, name: 'T-shirts with multiple colors, for men and lady', price: 78.99, qty: 1 },
      { id: 2, name: 'T-shirts with multiple colors, for men and lady', price: 39.00, qty: 1 },
      { id: 3, name: 'T-shirts with multiple colors, for men and lady', price: 170.50, qty: 1 },
    ];
    this.savedItems = [];
    this.discountAmount = 60.00;
    this.taxAmount = 14.00;
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateCartSummary();
  }

  attachEventListeners() {
    // Quantity change
    document.querySelectorAll('.cart-item select').forEach((select, index) => {
      select.addEventListener('change', (e) => this.handleQtyChange(index, e));
    });

    // Remove item buttons
    document.querySelectorAll('.item-links button:first-child').forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeItem(index);
      });
    });

    // Save for later buttons
    document.querySelectorAll('.item-links button:last-child').forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveForLater(index);
      });
    });

    // Remove all
    const removeAllBtn = document.querySelector('.remove-all');
    if (removeAllBtn) {
      removeAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Remove all items from cart?')) {
          this.cartItems = [];
          this.updateCartDisplay();
          this.updateCartSummary();
        }
      });
    }

    // Coupon apply
    const applyCouponBtn = document.querySelector('.summary .btn-primary');
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.applyCoupon();
      });
    }

    // Move to cart buttons in saved section
    document.querySelectorAll('.saved-item .btn-white').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const savedItem = btn.closest('.saved-item');
        const title = savedItem.querySelector('.saved-title').textContent;
        const price = parseFloat(savedItem.querySelector('.saved-price').textContent.replace('$', ''));
        this.moveToCart({ name: title, price: price, qty: 1 });
        alert('Item moved to cart!');
      });
    });
  }

  handleQtyChange(index, event) {
    const newQty = parseInt(event.target.value);
    if (newQty > 0 && this.cartItems[index]) {
      this.cartItems[index].qty = newQty;
      this.updateCartDisplay();
      this.updateCartSummary();
    }
  }

  removeItem(index) {
    if (confirm('Remove this item from cart?')) {
      this.cartItems.splice(index, 1);
      this.updateCartDisplay();
      this.updateCartSummary();
    }
  }

  saveForLater(index) {
    const item = this.cartItems[index];
    this.savedItems.push(item);
    this.removeItem(index);
    alert(`"${item.name.substring(0, 30)}..." saved for later!`);
  }

  moveToCart(item) {
    this.cartItems.push({ ...item, id: Date.now() });
    this.updateCartDisplay();
    this.updateCartSummary();
  }

  applyCoupon() {
    const input = document.querySelector('.coupon input');
    const coupon = input.value.trim().toUpperCase();
    
    if (!coupon) {
      alert('Please enter a coupon code');
      return;
    }

    const validCoupons = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'SUMMER50': 0.50
    };

    if (validCoupons[coupon]) {
      const discount = this.getSubtotal() * validCoupons[coupon];
      this.discountAmount = discount;
      alert(`Coupon applied! Discount: $${discount.toFixed(2)}`);
      input.value = '';
      this.updateCartSummary();
    } else {
      alert('Invalid coupon code');
    }
  }

  getSubtotal() {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    return subtotal - this.discountAmount + this.taxAmount;
  }

  updateCartDisplay() {
    const cartList = document.querySelector('.cart-list');
    const cartCountSpan = document.querySelector('h2 span');

    if (this.cartItems.length === 0) {
      cartList.innerHTML = '<li style="padding:20px;text-align:center;color:var(--muted);">Your cart is empty</li>';
      cartCountSpan.textContent = '(0)';
      return;
    }

    cartList.innerHTML = this.cartItems.map((item, index) => `
      <li class="cart-item">
        <img src="assets/Layout/alibaba/Image/cloth/image%2024.png" alt="${item.name}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="meta">Size: medium, Color: blue, Material: Plastic<br><span class="seller">Seller: Artel Market</span></p>
        </div>
        <div class="item-actions">
          <div class="price">$${item.price.toFixed(2)}</div>
          <label class="qty">Qty: <select data-index="${index}">
            <option ${item.qty === 1 ? 'selected' : ''}>1</option>
            <option ${item.qty === 3 ? 'selected' : ''}>3</option>
            <option ${item.qty === 5 ? 'selected' : ''}>5</option>
            <option ${item.qty === 9 ? 'selected' : ''}>9</option>
          </select></label>
          <div class="item-links"><button class="btn-white-sm">Remove</button><button class="btn-white-sm">Save for later</button></div>
        </div>
      </li>
    `).join('');

    cartCountSpan.textContent = `(${this.cartItems.length})`;

    // Re-attach event listeners after DOM update
    this.attachEventListeners();
  }

  updateCartSummary() {
    const subtotal = this.getSubtotal();
    const total = this.getTotal();

    const summaryLines = document.querySelector('.summary-lines');
    if (summaryLines) {
      summaryLines.innerHTML = `
        <div class="line"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="line"><span>Discount:</span><span class="neg">- $${this.discountAmount.toFixed(2)}</span></div>
        <div class="line"><span>Tax:</span><span class="pos">+ $${this.taxAmount.toFixed(2)}</span></div>
        <div class="line total"><span>Total:</span><strong>$${total.toFixed(2)}</strong></div>
      `;
    }
  }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  window.cartManager = new CartManager();
});

// Smooth scroll and utility functions
function smoothScroll(target) {
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
}

// Format currency
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

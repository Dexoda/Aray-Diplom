document.addEventListener('DOMContentLoaded', function() {
    // Enable tooltips everywhere
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Flash messages auto-hide
    setTimeout(function() {
      const alerts = document.querySelectorAll('.alert:not(.alert-persistent)');
      alerts.forEach(function(alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      });
    }, 5000);
    
    // Quantity input handlers in product detail
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
      const minusBtn = document.querySelector('.quantity-minus');
      const plusBtn = document.querySelector('.quantity-plus');
      
      if (minusBtn) {
        minusBtn.addEventListener('click', function() {
          if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
          }
        });
      }
      
      if (plusBtn) {
        plusBtn.addEventListener('click', function() {
          const max = parseInt(quantityInput.getAttribute('max') || 99);
          if (parseInt(quantityInput.value) < max) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
          }
        });
      }
    }
    
    // Cart quantity update
    const cartQuantityInputs = document.querySelectorAll('.cart-quantity');
    cartQuantityInputs.forEach(function(input) {
      input.addEventListener('change', function() {
        this.form.submit();
      });
    });
  });
let cart = [];

function addToCart(product, price) {
  cart.push({ product, price });
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.product} - $${item.price.toFixed(2)}`;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
}

function checkout() {
  // Create a PayPal checkout URL with cart data
  let url = 'https://www.paypal.com/cgi-bin/webscr?cmd=_cart&upload=1&business=zayyash2706@gmail.com';

  cart.forEach((item, index) => {
    url += `&item_name_${index + 1}=${encodeURIComponent(item.product)}&amount_${index + 1}=${item.price.toFixed(2)}&quantity_${index + 1}=1`;
  });

  window.open(url, '_blank');
}

#cart {
    border: 2px dashed var(--primary-color);
    padding: 20px;
    margin-top: 40px;
    background-color: #fff;
    max-width: 400px;
  }
  
  #cart h2 {
    color: var(--primary-color);
  }
  
  #cart ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
  }
  
  #cart li {
    margin-bottom: 5px;
  }
  
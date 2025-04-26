// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  // Reference to Firebase auth from the global firebaseApp
  const auth = getAuth(window.firebaseApp);
  console.log("Firebase Auth initialized");

  // CART
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // USER
  let currentUser = null;

  // Setup authentication state listener
  setupAuthStateListener();
  
  // Initialize geolocation
  initGeolocation();
  
  // Initialize other functionality
  fetchProducts();
  updateMiniCart();
  
  // Initialize event listeners for UI elements
  initializeEventListeners();
  
  // Function to set up auth state listener
  function setupAuthStateListener() {
    console.log("Setting up auth state listener...");
    
    const accountLink = document.getElementById('account-link');
    if (!accountLink) {
      console.error("Account link element not found!");
      return;
    }
    
    onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User: ${user.email}` : "No user");
      
      if (user) {
        // User is signed in
        currentUser = user;
        accountLink.href = "profile.html";
        const spanElement = accountLink.querySelector('span');
        if (spanElement) {
          spanElement.textContent = user.email;
        } else {
          console.error("Span element inside account link not found!");
          // Try to create one if it doesn't exist
          const newSpan = document.createElement('span');
          newSpan.textContent = user.email;
          accountLink.appendChild(newSpan);
        }
      } else {
        // No user is signed in
        currentUser = null;
        accountLink.href = "sign_in.html";
        const spanElement = accountLink.querySelector('span');
        if (spanElement) {
          spanElement.textContent = "Sign in account";
        }
      }
    });
  }

  async function fetchProducts() {
    try {
      console.log("Fetching products from Rootsy API...");
      const response = await fetch('https://rootsy-1.onrender.com/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Products fetched successfully:", data);
      
      if (data && data.length > 0) {
        renderProducts(data);
      } else {
        console.log("No products found.");
        displayNoProductsMessage("No products available at the moment. Please check back later.");
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      displayNoProductsMessage("Error fetching products. Please try again later.");
    }
  }

  function renderProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    
    if (!productGrid) {
      console.error("Product grid element not found!");
      return;
    }
    
    productGrid.innerHTML = ''; // Clear previous products

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" class="product-img">
        <h4>${product.name}</h4>
        <div class="price">
          <span class="new-price">₹${product.price}</span>
        </div>
        <div class="product-actions">
          <span class="stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">${product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}</span>
          ${product.stock > 0 ? `<button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>` : ''}
        </div>
      `;
      productGrid.appendChild(productCard);

      productCard.querySelector('.product-img').addEventListener('click', () => showProductPopup(product));
      const cartButton = productCard.querySelector('.add-to-cart');
      if (cartButton) {
        cartButton.addEventListener('click', () => addToCart(product));
      }
    });
  }

  function displayNoProductsMessage(message = "No products available at the moment. Please check back later.") {
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
      productGrid.innerHTML = `<p>${message}</p>`;
    }
  }

  // Show product details in a popup
  function showProductPopup(product) {
    const popup = document.createElement('div');
    popup.className = 'product-popup';
    popup.innerHTML = `
      <div class="popup-content">
        <span class="close-btn">&times;</span>
        <img src="${product.image_url}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description || 'No description available'}</p>
        <p><strong>Category:</strong> ${product.category_name || 'Uncategorized'}</p>
        <p><strong>Seller:</strong> ${product.seller_name || 'Unknown seller'}</p>
        <p><strong>Price:</strong> ₹${product.price}</p>
        <button class="add-to-cart" ${product.stock > 0 ? '' : 'disabled'}>Add to Cart</button>
      </div>
    `;
    document.body.appendChild(popup);

    popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());
    const addToCartBtn = popup.querySelector('.add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        addToCart(product);
        popup.remove();
      });
    }
  }

  // Add to cart
  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      } else {
        alert('Reached maximum stock!');
      }
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateMiniCart();
  }

  // Save cart
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Update Mini Cart
  function updateMiniCart() {
    const cartIcon = document.querySelector('.cart');
    if (cartIcon) {
      cartIcon.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><span>Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})</span>`;
    }

    let miniCart = document.querySelector('.mini-cart');
    if (!miniCart) {
      createMiniCart();
      miniCart = document.querySelector('.mini-cart');
    }

    if (!miniCart) {
      console.error("Mini cart element not found after attempting to create it!");
      return;
    }

    const cartContent = miniCart.querySelector('.mini-cart-content');
    if (!cartContent) {
      console.error("Mini cart content element not found!");
      return;
    }

    cartContent.innerHTML = '';

    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'mini-cart-item';
      div.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" />
        <div class="mini-cart-info">
          <h5>${item.name}</h5>
          <div>
            <button class="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="increase" data-id="${item.id}">+</button>
          </div>
          <p>₹${item.price * item.quantity}</p>
        </div>
      `;
      cartContent.appendChild(div);

      div.querySelector('.increase').addEventListener('click', () => changeQuantity(item.id, 1));
      div.querySelector('.decrease').addEventListener('click', () => changeQuantity(item.id, -1));
    });
  }

  // Create Mini Cart HTML
  function createMiniCart() {
    const miniCart = document.createElement('div');
    miniCart.className = 'mini-cart';
    miniCart.innerHTML = `
      <div class="mini-cart-content"></div>
      <div class="mini-cart-footer">
        <button onclick="location.href='cart.html'">Go to Cart</button>
      </div>
    `;
    document.body.appendChild(miniCart);

    const cartElement = document.querySelector('.cart');
    if (cartElement) {
      cartElement.addEventListener('click', (e) => {
        e.preventDefault();
        miniCart.classList.toggle('open');
      });
    }
  }

  // Change Quantity
  function changeQuantity(productId, delta) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(p => p.id !== productId);
    }
    saveCart();
    updateMiniCart();
  }

  // Initialize event listeners for filters
  function initializeEventListeners() {
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
      filterBtn.addEventListener('click', async function() {
        // Get filter values
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;
        console.log(`Filtering products between ₹${minPrice} and ₹${maxPrice}`);
        
        try {
          // Call API with filter parameters
          const response = await fetch(`https://rootsy-1.onrender.com/products?minPrice=${minPrice}&maxPrice=${maxPrice}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          renderProducts(data);
        } catch (error) {
          console.error('Error filtering products:', error);
          displayNoProductsMessage("Error applying filters. Please try again.");
        }
      });
    }
    
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function() {
        // Reset all filters
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const rangeMinInput = document.getElementById('range-min');
        const rangeMaxInput = document.getElementById('range-max');
        
        if (minPriceInput) minPriceInput.value = 0;
        if (maxPriceInput) maxPriceInput.value = 30;
        if (rangeMinInput) rangeMinInput.value = 0;
        if (rangeMaxInput) rangeMaxInput.value = 300000;
        
        // Reset checkboxes
        document.querySelectorAll('.categories input[type="checkbox"]').forEach(checkbox => {
          checkbox.checked = true;
        });
        
        document.getElementById('in-stock')?.removeAttribute('checked');
        document.getElementById('on-sale')?.removeAttribute('checked');
        
        // Reload products
        fetchProducts();
      });
    }
  }

  function initGeolocation() {
    console.log("Starting geolocation process...");
    const locationElement = document.getElementById('user-location');
    
    if (locationElement) {
      locationElement.textContent = "Requesting location...";
    }
    
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser");
      displayLocation("Geolocation not supported");
      return;
    }
    
    try {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        showLocation,
        // Error callback
        showError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      console.error("Error when requesting geolocation:", error);
      displayLocation("Error requesting location");
    }
  }

  function showLocation(position) {
    console.log("Location obtained:", position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    displayLocation(`Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`;

    fetch(nominatimUrl, { 
      headers: { 
        'Accept-Language': 'en',
        'User-Agent': 'RootsyWebApp/1.0'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const address = data.address || {};
      let locationString = constructAddressString(address);
      
      console.log("Location data: ", data);
      displayLocation(locationString);
    })
    .catch(error => {
      console.error("Geocoding error:", error);
      displayLocation("Error fetching location details");
    });
  }

  function constructAddressString(address) {
    const houseNumber = address.house_number || "";
    const street = address.road || address.street || "";
    const suburb = address.suburb || "";
    const city = address.city || "";
    const state = address.state || "";
    const country = address.country || "";

    let locationParts = [];
    if (houseNumber && street) {
      locationParts.push(`${houseNumber} ${street}`);
    } else if (street) {
      locationParts.push(street);
    }

    if (suburb) locationParts.push(suburb);
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    if (country) locationParts.push(country);

    return locationParts.join(", ") || "Location details unavailable";
  }

  function showError(error) {
    let errorMessage = "";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location access denied by user.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out.";
        break;
      default:
        errorMessage = `Unknown error: ${error.message}`;
    }
    console.error("Geolocation error:", errorMessage);
    displayLocation(errorMessage);
  }

  function displayLocation(text) {
    const locationElement = document.getElementById('user-location');
    if (locationElement) {
      locationElement.textContent = text;
    } else {
      console.error("Location element not found");
    }
  }
});
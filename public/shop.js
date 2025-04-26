// shop.js

// Initialize Supabase
const supabase = createClient('https://takraoqafzlolecjgtgn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRha3Jhb3FhZnpsb2xlY2pndGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDc4NTMsImV4cCI6MjA2MDQ4Mzg1M30.XMVvPXRnI5Z_0R-3Pn9OHUAkAT6mzpQJc6pu0q3aegs');

// Initialize Firebase
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    const accountLink = document.getElementById('account-link');
  
    if (user) {
      // User is signed in
      const email = user.email;
      accountLink.href = "profile.html"; // Redirect to profile page
      accountLink.querySelector('span').textContent = email;
    } else {
      // No user is signed in
      accountLink.href = "sign_in.html";
      accountLink.querySelector('span').textContent = "Sign in account";
    }
  });

// CART
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// USER
let currentUser = null;

// Fetch products
async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  renderProducts(data);
}

// Render products to grid
function renderProducts(products) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = '';

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

// Show product details in a popup
function showProductPopup(product) {
  const popup = document.createElement('div');
  popup.className = 'product-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      <img src="${product.image_url}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p><strong>Category:</strong> ${product.category_name}</p>
      <p><strong>Seller:</strong> ${product.seller_name}</p>
      <p><strong>Price:</strong> ₹${product.price}</p>
      <button class="add-to-cart" ${product.stock > 0 ? '' : 'disabled'}>Add to Cart</button>
    </div>
  `;
  document.body.appendChild(popup);

  popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());
  popup.querySelector('.add-to-cart')?.addEventListener('click', () => {
    addToCart(product);
    popup.remove();
  });
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
  cartIcon.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><span>Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})</span>`;

  const miniCart = document.querySelector('.mini-cart');
  if (!miniCart) {
    createMiniCart();
  }

  const cartContent = document.querySelector('.mini-cart-content');
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

  document.querySelector('.cart').addEventListener('click', () => {
    miniCart.classList.toggle('open');
  });
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

// Monitor Firebase Authentication
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('User logged in:', user.email);
  } else {
    currentUser = null;
    console.log('User logged out');
  }
});

// Initial calls
fetchProducts();
updateMiniCart();


function initGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showLocation,
        showError,
        {
          enableHighAccuracy: true,  // Changed to true for better accuracy
          timeout: 10000,           // Added timeout setting (10 seconds)
          maximumAge: 0             // Don't use cached position
        }
      );
    } else {
      displayLocation("Geolocation not supported by this browser");
    }
  }
  
  function showLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // Added zoom parameter for more detailed results
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`;
    
    fetch(nominatimUrl, { 
      headers: { 
        'Accept-Language': 'en',
        'User-Agent': 'YourAppName/1.0' // Add User-Agent for API etiquette
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
        
        // More comprehensive address component collection
        const houseNumber = address.house_number || "";
        const street = address.road || address.street || address.pedestrian || address.footway || address.path || "";
        const suburb = address.suburb || address.neighbourhood || address.quarter || "";
        const city = address.city || address.town || address.village || address.hamlet || "";
        const county = address.county || address.state_district || "";
        const state = address.state || "";
        const country = address.country || "";
        const postcode = address.postcode || "";
        
        // Format a detailed address string
        let locationParts = [];
        
        // Add house number and street if available
        if (houseNumber && street) {
          locationParts.push(`${houseNumber} ${street}`);
        } else if (street) {
          locationParts.push(street);
        }
        
        // Add suburb if available
        if (suburb) {
          locationParts.push(suburb);
        }
        
        // Add city/town
        if (city) {
          locationParts.push(city);
        }
        
        // Add county if city is not available
        if (!city && county) {
          locationParts.push(county);
        }
        
        // Add state if different from city
        if (state && state !== city) {
          locationParts.push(state);
        }
        
        // Fallback options if we couldn't construct a good address
        const displayName = data.display_name || "";
        
        const locationString = locationParts.length > 0 
          ? locationParts.join(", ")
          : displayName || "Location details unavailable";
        
        // Also log coordinates for debugging
        console.log(`Coordinates: ${latitude}, ${longitude}`);
        console.log("Full address data:", data);
        
        displayLocation(locationString);
      })
      .catch(error => {
        console.error("Geocoding error:", error);
        displayLocation("Location service error");
      });
  }
  
  function showError(error) {
    let message = "";
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = "Location access denied by user";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information unavailable";
        break;
      case error.TIMEOUT:
        message = "Location request timed out";
        break;
      default:
        message = `Unknown location error: ${error.message}`;
    }
    console.error("Geolocation error:", error);
    displayLocation(message);
  }
  
  function displayLocation(text) {
    const locationElement = document.getElementById('user-location');
    if (locationElement) {
      locationElement.textContent = text;
    } else {
      console.error("Location display element not found");
    }
  }
  
  // Call this on page load or after auth
  window.addEventListener('DOMContentLoaded', initGeolocation);
function signOutUser() {
  auth.signOut().then(function() {
    window.location.href = "sign_in.html";
  });
}
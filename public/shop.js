// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Supabase (make sure this runs after the Supabase script is loaded)
const supabase = supabaseJs.createClient('https://takraoqafzlolecjgtgn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRha3Jhb3FhZnpsb2xlY2pndGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDc4NTMsImV4cCI6MjA2MDQ4Mzg1M30.XMVvPXRnI5Z_0R-3Pn9OHUAkAT6mzpQJc6pu0q3aegs');

// Add Firebase configuration
const firebaseConfig = {
  // Replace with your actual Firebase config
    apiKey: "AIzaSyAwrxSvkDSSk7AdhcTeo_joMkRbdGszmD8",
    authDomain: "rootsy-ec110.firebaseapp.com",
    projectId: "rootsy-ec110",
    storageBucket: "rootsy-ec110.appspot.com",
    messagingSenderId: "120254624474",
    appId: "1:120254624474:web:1ea4defdbf9d56c8ba2be3",
    measurementId: "G-0Y636N5BPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// CART
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// USER
let currentUser = null;

// Monitor Firebase Authentication
onAuthStateChanged(auth, (user) => {
  const accountLink = document.getElementById('account-link');
  
  if (user) {
    // User is signed in
    currentUser = user;
    console.log('User logged in:', user.email);
    accountLink.href = "profile.html"; // Redirect to profile page
    accountLink.querySelector('span').textContent = user.email;
  } else {
    // No user is signed in
    currentUser = null;
    console.log('User logged out');
    accountLink.href = "sign_in.html";
    accountLink.querySelector('span').textContent = "Sign in account";
  }
});

async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    alert("Error fetching products. Please try again later.");
    return;
  }
  
  console.log("Products fetched successfully:", data); // Check the structure of the data
  if (data && data.length > 0) {
    renderProducts(data);
  } else {
    console.log("No products found.");
    displayNoProductsMessage();
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

function displayNoProductsMessage() {
  const productGrid = document.querySelector('.product-grid');
  if (productGrid) {
    productGrid.innerHTML = '<p>No products available at the moment. Please check back later.</p>';
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
      <p>${product.description}</p>
      <p><strong>Category:</strong> ${product.category_name}</p>
      <p><strong>Seller:</strong> ${product.seller_name}</p>
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

  const cartContent = miniCart.querySelector('.mini-cart-content');
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

function initGeolocation() {
  if (navigator.geolocation) {
    console.log("Geolocation is supported");
    navigator.geolocation.getCurrentPosition(
      showLocation,
      showError,
      {
        enableHighAccuracy: true,  // Higher accuracy
        timeout: 10000,            // 10-second timeout
        maximumAge: 0              // No cached position
      }
    );
  } else {
    console.error("Geolocation not supported by this browser");
    displayLocation("Geolocation not supported");
  }
}

function showLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  
  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`;

  fetch(nominatimUrl, { 
    headers: { 
      'Accept-Language': 'en',
      'User-Agent': 'YourAppName/1.0'
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

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  fetchProducts();
  updateMiniCart();
  initGeolocation();
  
  // Set up event listeners for filters
  const filterBtn = document.getElementById('filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', function() {
      // Implement price filtering logic here
      const minPrice = document.getElementById('min-price').value;
      const maxPrice = document.getElementById('max-price').value;
      console.log(`Filtering products between ₹${minPrice} and ₹${maxPrice}`);
      // You would typically call fetchProducts() with filter parameters here
    });
  }
});
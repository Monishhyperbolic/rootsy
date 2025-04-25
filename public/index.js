

function initGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      showLocation,
      showError,
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000
      }
    );
  } else {
    displayLocation("Geolocation not supported by this browser");
  }
}

function showLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

  fetch(nominatimUrl, { headers: { 'Accept-Language': 'en' } })
    .then(response => response.json())
    .then(data => {
      const address = data.address || {};

      const street = address.road || address.street || address.pedestrian || "";
      const city = address.city || address.town || address.village || address.hamlet || "";

      const locationString = street && city
        ? `${street}, ${city}`
        : city || street || "Location unavailable";

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
      message = "Location access denied";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Location unavailable";
      break;
    case error.TIMEOUT:
      message = "Location request timed out";
      break;
    default:
      message = "Unknown location error";
  }
  displayLocation(message);
}

function displayLocation(text) {
  const locationElement = document.getElementById('user-location');
  if (locationElement) {
    locationElement.textContent = text;
  }
}

// Call this on page load or after auth
window.addEventListener('DOMContentLoaded', initGeolocation);

function signOutUser() {
  auth.signOut().then(function() {
    window.location.href = "sign_in.html";
  });
}

// Function to scroll categories
function scrollCategory(amount) {
  const container = document.getElementById('categoryContainer');
  if (container) {
    container.scrollLeft += amount;
  }
}


// Banner slider functionality
function startBannerSlider() {
  const bannerBoxes = document.querySelectorAll('.banner-box');
  
  bannerBoxes.forEach(box => {
    const slides = box.querySelectorAll('.banner-slide');
    if (slides.length > 1) {
      let currentSlide = 0;
      
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 5000);
    }
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Init cart count
  updateCartCount();
  
  // Start banner sliders
  startBannerSlider();
  
  // Add to cart click listener
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      let cardElem = e.target.closest('.card, .ccard');
      if (cardElem) addToCartFromCard(cardElem);
    }
  });
});


function rotateSlides(bannerId) {
const slides = document.querySelectorAll(`#${bannerId} .banner-slide`);
let current = 0;
setInterval(() => {
slides[current].classList.remove('active');
current = (current + 1) % slides.length;
slides[current].classList.add('active');
}, 4000);
}

rotateSlides('banner1');
rotateSlides('banner2');

// category-scroll button


function scrollcategory(amount) {
const container = document.getElementById('categoryContainer');
container.scrollLeft += amount;
}


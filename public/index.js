

// Fixed geolocation functionality
function initGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation, showError);
  } else {
    const locationElement = document.getElementById('user-location');
    if (locationElement) {
      locationElement.textContent = "Geolocation not supported by this browser";
    }
  }
}

function showLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
    .then(response => response.json())
    .then(data => {
      console.log("Geolocation data:", data); // Debug log to see what we're getting
      let locationString = "";

      if (data.address) {
        // Get street name with proper fallbacks
        const street = data.address.road || data.address.pedestrian || data.address.street || "";
        
        // Get city with proper fallbacks
        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || "";
        
        // Format as "street, city" when both are available
        if (street && city) {
          locationString = `${street}, ${city}`;
        } else if (street) {
          locationString = street;
        } else if (city) {
          locationString = city;
        } else {
          // Fallback to locality + city if street is not available
          const locality = data.address.suburb || data.address.neighbourhood || data.address.city_district || "";
          if (locality && city) {
            locationString = `${locality}, ${city}`;
          } else if (locality) {
            locationString = locality;
          } else {
            locationString = "Location unavailable";
          }
        }
      } else {
        locationString = "Location unavailable";
      }

      // Display location
      const locationElement = document.getElementById('user-location');
      if (locationElement) {
        locationElement.textContent = locationString;
      }
    })
    .catch(error => {
      console.error('Geocoding error:', error);
      const locationElement = document.getElementById('user-location');
      if (locationElement) {
        locationElement.textContent = "Location service error";
      }
    });
}

function showError(error) {
  const locationElement = document.getElementById('user-location');
  if (locationElement) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        locationElement.textContent = "Location access denied";
        break;
      case error.POSITION_UNAVAILABLE:
        locationElement.textContent = "Location information unavailable";
        break;
      case error.TIMEOUT:
        locationElement.textContent = "Location request timed out";
        break;
      case error.UNKNOWN_ERROR:
        locationElement.textContent = "Unknown location error";
        break;
    }
  }
}

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


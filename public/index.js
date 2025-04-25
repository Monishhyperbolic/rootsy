
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


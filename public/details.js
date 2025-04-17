const BASE_URL = 'postgres-production-1341.up.railway.app';
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

fetch(`${BASE_URL}/product/${productId}`)
  .then(res => res.json())
  .then(product => {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-img').src = product.image_url;
    document.getElementById('product-price').textContent = `₹${product.price}`;
    document.getElementById('product-desc').textContent = product.description;
    document.getElementById('product-model').innerHTML = `<a href="${product.model_url}" target="_blank">View 3D Model</a>`;
  });

// public/category.js
const BASE_URL = ''; // same origin, leave blank when frontend served by backend
const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

// Load categories into dropdown
async function loadCategories() {
  const res = await fetch(`${BASE_URL}/api/categories`);
  const categories = await res.json();

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    filter.appendChild(option);
  });
}

// Fetch and display products
async function fetchProducts(categoryId = '') {
  let url = `${BASE_URL}/api/products`;
  if (categoryId) url += `?category_id=${categoryId}`;

  const res = await fetch(url);
  const products = await res.json();

  productList.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
    `;
    productList.appendChild(card);
  });
}

// Event listeners
filter.addEventListener('change', e => {
  fetchProducts(e.target.value);
});

// Init
loadCategories();
fetchProducts();

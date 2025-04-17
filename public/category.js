const BASE_URL = 'https://rootsy-production.up.railway.app/api';
const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

// Populate categories
async function fetchCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();

    data.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      filter.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

// Populate products
async function fetchProducts(categoryId = '') {
  try {
    let url = `${BASE_URL}/products`;
    if (categoryId) url += `?category_id=${categoryId}`;

    const res = await fetch(url);
    const data = await res.json();

    productList.innerHTML = '';
    data.forEach(product => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
      `;
      productList.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

filter.addEventListener('change', (e) => {
  fetchProducts(e.target.value);
});

// Initialize
fetchCategories();
fetchProducts();

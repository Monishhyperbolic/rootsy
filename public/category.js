
const BASE_URL = 'http://localhost:3000/api';  // Change this to the production API URL if needed
const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

async function fetchProducts(category = '') {
  let url = `${BASE_URL}/products`;  // Ensure this is pointing to the correct endpoint
  if (category) url += `?category_id=${category}`;  // Correct query parameter (category_id)

  const res = await fetch(url);
  
  if (!res.ok) {
    console.error('Failed to fetch products', res);
    return;
  }
  
  const data = await res.json();

  productList.innerHTML = ''; // Clear current product list

  if (data.length === 0) {
    productList.innerHTML = '<p>No products found for the selected category.</p>';
    return;
  }

  // Add products to the grid
  data.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
    `;
    card.onclick = () => window.location.href = `detail.html?id=${product.id}`;
    productList.appendChild(card);
  });
}

filter.addEventListener('change', e => {
  fetchProducts(e.target.value);
});

// Initial load (fetch all products)
fetchProducts();


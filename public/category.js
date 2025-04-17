const BASE_URL = 'postgres-production-1341.up.railway.app/api';  // Update to your production URL if needed
const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

// Function to fetch and display categories
async function fetchCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();

    // Populate category filter dropdown
    data.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.innerText = category.name;
      filter.appendChild(option);
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
}

// Function to fetch and display products based on category
async function fetchProducts(category = '') {
  let url = `${BASE_URL}/products`;  // Default URL

  if (category) {
    url += `?category_id=${category}`;  // Add category filter
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Clear previous products
    productList.innerHTML = '';

    if (data.length === 0) {
      productList.innerHTML = '<p>No products found for the selected category.</p>';
      return;
    }

    // Display the products in the grid
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
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

// Event listener for category filter change
filter.addEventListener('change', e => {
  fetchProducts(e.target.value);  // Fetch products based on selected category
});

// Initial load of categories and products
fetchCategories();
fetchProducts();

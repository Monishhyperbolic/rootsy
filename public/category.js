const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

// Fetch all products or products by category
async function fetchProducts(categoryId = '') {
  let url = '/api/products';
  if (categoryId) {
    url += `?category=${categoryId}`;
  }

  try {
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
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Event listener for category filter
filter.addEventListener('change', e => {
  fetchProducts(e.target.value);
});

// Initial fetch
fetchProducts();

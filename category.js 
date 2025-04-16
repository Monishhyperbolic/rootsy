const BASE_URL = 'https://rootsy.railway.internal/api';
const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

async function fetchProducts(category = '') {
  let url = `${BASE_URL}/products`;
  if (category) url += `?category=${category}`;

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
    card.onclick = () => window.location.href = `detail.html?id=${product.id}`;
    productList.appendChild(card);
  });
}

filter.addEventListener('change', e => {
  fetchProducts(e.target.value);
});

fetchProducts();

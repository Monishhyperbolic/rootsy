const SUPABASE_URL = 'https://takraoqafzlolecjgtgn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRha3Jhb3FhZnpsb2xlY2pndGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDc4NTMsImV4cCI6MjA2MDQ4Mzg1M30.XMVvPXRnI5Z_0R-3Pn9OHUAkAT6mzpQJc6pu0q3aegs';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

async function loadCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Failed to load categories:', error.message);
    return;
  }

  data.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    filter.appendChild(option);
  });
}

async function fetchProducts(categoryId = '') {
  let query = supabase.from('products').select('*');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  productList.innerHTML = '';

  if (error) {
    console.error('Error loading products:', error.message);
    return;
  }

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
}

filter.addEventListener('change', e => {
  fetchProducts(e.target.value);
});

loadCategories();
fetchProducts();

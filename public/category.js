const supabaseUrl = 'https://takraoqafzlolecjgtgn.supabase.co'; // <-- Replace this
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRha3Jhb3FhZnpsb2xlY2pndGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDc4NTMsImV4cCI6MjA2MDQ4Mzg1M30.XMVvPXRnI5Z_0R-3Pn9OHUAkAT6mzpQJc6pu0q3aegs';                    // <-- Replace this
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const filter = document.getElementById('filter');
const productList = document.getElementById('product-list');

// Load categories into dropdown
async function loadCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Failed to fetch categories:', error.message);
    return;
  }

  data.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    filter.appendChild(option);
  });
}

// Load products
async function fetchProducts(categoryId = '') {
  let query = supabase.from('products').select('*');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to fetch products:', error.message);
    return;
  }

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
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  fetchProducts();
  filter.addEventListener('change', e => fetchProducts(e.target.value));
});

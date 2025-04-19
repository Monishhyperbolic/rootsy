
// Make sure to include this line first
const supabase = supabase.createClient(
  'https://takraoqafzlolecjgtgn.supabase.co', // Replace with your actual Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRha3Jhb3FhZnpsb2xlY2pndGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDc4NTMsImV4cCI6MjA2MDQ4Mzg1M30.XMVvPXRnI5Z_0R-3Pn9OHUAkAT6mzpQJc6pu0q3aegs' // Replace with your actual anon key
);

const productList = document.getElementById('product-list');
const filter = document.getElementById('filter');

// Fetch categories
async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    console.error("Error fetching categories:", error);
    return;
  }

  // Populate dropdown
  data.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    filter.appendChild(option);
  });

  console.log("Fetched Categories:", data); // Debug: Check the categories
}

// Fetch products based on selected category
async function fetchProducts(category = '') {
  let query = supabase.from('products').select('*');

  if (category) {
    query = query.eq('category_id', category);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  productList.innerHTML = ''; // Clear previous list

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

  console.log("Fetched Products:", data); // Debug: Check the products
}

filter.addEventListener('change', e => {
  fetchProducts(e.target.value); // Fetch products based on category selected
});

fetchCategories(); // Initialize categories when the page loads
fetchProducts(); // Fetch products for all categories initially


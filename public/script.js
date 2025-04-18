document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('categorySelect');
    const productList = document.getElementById('productList');
  
    // Load categories
    const categories = await fetch('/api/categories').then(res => res.json());
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  
    // Load products for selected category
    categorySelect.addEventListener('change', async () => {
      const categoryId = categorySelect.value;
      const products = await fetch(`/api/products?category_id=${categoryId}`).then(res => res.json());
  
      productList.innerHTML = '';
      if (products.length === 0) {
        productList.innerHTML = '<li>No products found</li>';
      } else {
        products.forEach(product => {
          const li = document.createElement('li');
          li.textContent = product.name;
          productList.appendChild(li);
        });
      }
    });
  
    // Load initial category if any exist
    if (categories.length > 0) {
      categorySelect.value = categories[0].id;
      categorySelect.dispatchEvent(new Event('change'));
    }
  });
  
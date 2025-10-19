// Create product page  
const createProductForm = document.getElementById('create-product-form');
const categorySelect = document.getElementById('category');

// Fetch categories  
async function fetchCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        let categories = await response.json();
        // If categories are objects, extract the name property
        if (Array.isArray(categories) && categories.length > 0 && typeof categories[0] === 'object') {
            categories = categories.map(cat => cat.name);
        }
        categorySelect.innerHTML = categories.map(category => `
            <option value="${category}">${category}</option>
        `).join('');
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Create new product
async function createProduct(productData) {
    try {
        const response = await fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        if (data.id) {
            showCreateToast();
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1800);
        } else {
            throw new Error('Failed to create product');
        }
    } catch (error) {
        console.error('Error creating product:', error);
        showCreateToast('Error creating product. Please try again later.', true);
    }
}

// Show Bootstrap toast notification
function showCreateToast(message = 'Product created successfully!', isError = false) {
    const toastEl = document.getElementById('createToast');
    if (!toastEl) return;
    toastEl.querySelector('.toast-body').textContent = message;
    toastEl.classList.remove('text-bg-success', 'text-bg-danger');
    toastEl.classList.add(isError ? 'text-bg-danger' : 'text-bg-success');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Form submit handler
createProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        brand: document.getElementById('brand').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    
    createProduct(productData);
});

// Initialize page
document.addEventListener('DOMContentLoaded', fetchCategories);
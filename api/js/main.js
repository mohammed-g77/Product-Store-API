//   endpoints
const API_BASE_URL = 'https://dummyjson.com';
const PRODUCTS_PER_PAGE = 10;
 
const categoriesContainer = document.getElementById('categories-container');
const productsContainer = document.getElementById('products-container');
// Fetch and display categories
async function fetchCategories() {
    try {
        
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        console.log('Fetched categories:', categories);  
        
        
        if (!categories || categories.length === 0) {
            const categoryListResponse = await fetch(`${API_BASE_URL}/products/category-list`);
            if (!categoryListResponse.ok) {
                throw new Error(`HTTP error! status: ${categoryListResponse.status}`);
            }
            const categoryList = await categoryListResponse.json();
            displayCategories(categoryList);
        } else {
            displayCategories(categories);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        categoriesContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    Error loading categories. Please try again later.
                </div>
            </div>
        `;
    }
}

// Display categories
function displayCategories(categories) {
    if (!categoriesContainer) {
        console.error('Categories container not found!');
        return;
    }
    if (!Array.isArray(categories)) {
        console.error('Categories is not an array:', categories);
        return;
    }
     
    if (categories.length > 0 && typeof categories[0] === 'object') {
        categories = categories.map(cat => cat.name);
    }
    categoriesContainer.innerHTML = categories.map(category => `
        <div class="col-md-3 col-sm-6 mb-3">
            <div class="card category-card h-100 shadow-sm" onclick="loadCategoryProducts('${category}')">
                <div class="card-body text-center">
                     
                    <h5 class="card-title text-capitalize mb-0">${category}</h5>
                </div>
            </div>
        </div>
    `).join('');
}

// Fetch and display products
async function fetchProducts(limit = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`);
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products
function displayProducts(products) {
    productsContainer.innerHTML = products.map(product => `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="card product-card">
                <img src="${product.thumbnail}" class="card-img-top product-image" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">$${product.price}</p>
                    <div class="rating">
                        ${generateStarRating(product.rating)}
                    </div>
                    <a href="product-details.html?id=${product.id}" class="btn btn-primary mt-2">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Load products by category
async function loadCategoryProducts(category) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayProducts(data.products);
        
       
        document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching category products:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
   
    if (document.querySelector('.categories-section')) {
        fetchCategories();
        fetchProducts();
    }
});
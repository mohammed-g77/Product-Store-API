// Products page  
const productsContainer = document.getElementById('products-container');
const paginationContainer = document.getElementById('pagination');
const sortBySelect = document.getElementById('sortBy');
const sortOrderSelect = document.getElementById('sortOrder');

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let totalProducts = 0;
let currentProducts = [];
 
//  sorting
sortBySelect.addEventListener('change', updateProductDisplay);
sortOrderSelect.addEventListener('change', updateProductDisplay);

//   pagination
async function fetchProducts(page = 1, limit = ITEMS_PER_PAGE) {
    try {
        const skip = (page - 1) * limit;
        const category = new URLSearchParams(window.location.search).get('category');
        
        let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
        if (category) {
            url = `https://dummyjson.com/products/category/${category}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        totalProducts = data.total;
        currentProducts = data.products;
        updateProductDisplay();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Update product display with sorting
function updateProductDisplay() {
    const sortBy = sortBySelect.value;
    const sortOrder = sortOrderSelect.value;
    
    // Sort products
    const sortedProducts = [...currentProducts].sort((a, b) => {
        const compareValue = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'price') {
            return (a.price - b.price) * compareValue;
        } else {
            return a.title.localeCompare(b.title) * compareValue;
        }
    });

     
    displayProducts(sortedProducts);
    updatePagination();
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

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add click events to pagination buttons
    document.querySelectorAll('.page-link').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = parseInt(e.target.dataset.page);
            if (newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
                currentPage = newPage;
                fetchProducts(currentPage);
            }
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(currentPage);
});
// Product details page specific JavaScript
const productDetailsContainer = document.getElementById('product-details-container');

// Fetch product details
async function fetchProductDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            throw new Error('Product ID not provided');
        }

        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetailsContainer.innerHTML = `
            <div class="alert alert-danger">
                Error loading product details. Please try again later.
            </div>
        `;
    }
}

// Display product details
function displayProductDetails(product) {
    productDetailsContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${product.images.map((image, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${image}" class="d-block w-100 product-details-image" alt="${product.title}">
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div class="col-md-6">
                <h1 class="mb-4">${product.title}</h1>
                <div class="rating mb-3">
                    ${generateStarRating(product.rating)}
                    <span class="ms-2">(${product.rating})</span>
                </div>
                <p class="h3 text-primary mb-4">$${product.price}</p>
                <p class="mb-4">${product.description}</p>
                <div class="d-flex gap-3 mb-4">
                    <span class="badge bg-success">Brand: ${product.brand}</span>
                    <span class="badge bg-info">Category: ${product.category}</span>
                </div>
                <div class="mb-4">
                    <h5>Product Details:</h5>
                    <ul class="list-unstyled">
                        <li><strong>Stock:</strong> ${product.stock} units</li>
                        <li><strong>Discount:</strong> ${product.discountPercentage}%</li>
                    </ul>
                </div>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete Product</button>
            </div>
        </div>
    `;
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

// Delete product
async function deleteProduct(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.isDeleted) {
            showDeleteToast();
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1800);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showDeleteToast('Error deleting product. Please try again later.', true);
    }
}

// Show Bootstrap toast notification
function showDeleteToast(message = 'Product deleted successfully!', isError = false) {
    const toastEl = document.getElementById('deleteToast');
    if (!toastEl) return;
    toastEl.querySelector('.toast-body').textContent = message;
    toastEl.classList.remove('text-bg-success', 'text-bg-danger');
    toastEl.classList.add(isError ? 'text-bg-danger' : 'text-bg-success');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Initialize page
document.addEventListener('DOMContentLoaded', fetchProductDetails);
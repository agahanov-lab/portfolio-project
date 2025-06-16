// Blog page specific JavaScript functionality

let currentPage = 1;
let allBlogPosts = [];
const itemsPerPage = 6;

// DOM elements
const blogList = document.getElementById('blog-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');

// Fetch all blog posts from the API
async function loadAllBlogPosts() {
    showLoading(true);
    
    try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        allBlogPosts = await response.json();
        displayBlogPosts();
        updatePagination();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showEmptyState(true);
    } finally {
        showLoading(false);
    }
}

// Display blog posts for current page
function displayBlogPosts() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagePosts = allBlogPosts.slice(startIndex, endIndex);
    
    if (pagePosts.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    blogList.innerHTML = pagePosts.map(createBlogPostListItem).join('');
    
    // Re-observe elements for fade-in animation
    if (window.reobserveElements) {
        setTimeout(window.reobserveElements, 100);
    }
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(allBlogPosts.length / itemsPerPage);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    if (totalPages > 0) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    } else {
        pageInfo.textContent = '';
    }
}

// Show/hide loading state
function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
        blogList.classList.add('hidden');
        emptyState.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
        blogList.classList.remove('hidden');
    }
}

// Show/hide empty state
function showEmptyState(show) {
    if (show) {
        emptyState.classList.remove('hidden');
        blogList.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        blogList.classList.remove('hidden');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load blog posts on page load
    loadAllBlogPosts();
    
    // Pagination button handlers
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayBlogPosts();
            updatePagination();
            
            // Scroll to top of blog list
            blogList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(allBlogPosts.length / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            displayBlogPosts();
            updatePagination();
            
            // Scroll to top of blog list
            blogList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
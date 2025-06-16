// Main JavaScript file for common functionality across all pages

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Fetch data from API endpoints
async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Create project card HTML
function createProjectCard(project) {
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-900">${project.title}</h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">${project.category}</span>
            </div>
            <p class="text-gray-600 mb-4">${project.description}</p>
            <div class="flex items-center justify-between">
                <button class="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View Details →
                </button>
            </div>
        </div>
    `;
}

// Create blog post HTML
function createBlogPostCard(post) {
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">${post.title}</h3>
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Read Article
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 9l6-6m0 0h4m-4 0v4"></path>
                </svg>
            </a>
        </div>
    `;
}

// Create blog post list item HTML (for blog page)
function createBlogPostListItem(post) {
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow fade-in">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="flex-1">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">${post.title}</h3>
                    <p class="text-gray-600 mb-4 md:mb-0">Click to read the full article on the external platform</p>
                </div>
                <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Read Article
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 9l6-6m0 0h4m-4 0v4"></path>
                    </svg>
                </a>
            </div>
        </div>
    `;
}

// Load latest projects for homepage
async function loadLatestProjects() {
    const container = document.getElementById('latest-projects');
    if (!container) return;

    const projects = await fetchData('/api/projects/latest');
    if (projects && projects.length > 0) {
        container.innerHTML = projects.map(createProjectCard).join('');
    } else {
        container.innerHTML = '<p class="text-gray-600 text-center col-span-full">No projects found.</p>';
    }
}

// Load latest blog posts for homepage
async function loadLatestBlogPosts() {
    const container = document.getElementById('latest-blog');
    if (!container) return;

    const posts = await fetchData('/api/blog/latest');
    if (posts && posts.length > 0) {
        container.innerHTML = posts.map(createBlogPostCard).join('');
    } else {
        container.innerHTML = '<p class="text-gray-600 text-center col-span-full">No blog posts found.</p>';
    }
}

// Initialize homepage content
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    document.addEventListener('DOMContentLoaded', function() {
        loadLatestProjects();
        loadLatestBlogPosts();
    });
}
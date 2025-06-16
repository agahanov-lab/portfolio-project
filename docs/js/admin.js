// Admin panel JavaScript functionality

// Authentication state
let isAuthenticated = false;

// DOM elements
const loginSection = document.getElementById('login-section');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Project management elements
const addProjectForm = document.getElementById('add-project-form');
const projectsList = document.getElementById('projects-list');

// Blog management elements
const addBlogForm = document.getElementById('add-blog-form');
const blogList = document.getElementById('blog-list');

// Check authentication status on page load
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/admin/status');
        const data = await response.json();
        
        if (data.authenticated) {
            isAuthenticated = true;
            showDashboard();
            loadProjects();
            loadBlogPosts();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showLogin();
    }
}

// Show login form
function showLogin() {
    loginSection.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    isAuthenticated = false;
}

// Show admin dashboard
function showDashboard() {
    loginSection.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    isAuthenticated = true;
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(loginForm);
    const password = formData.get('password');
    
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    loginError.classList.add('hidden');
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        
        if (response.ok) {
            showDashboard();
            loadProjects();
            loadBlogPosts();
            loginForm.reset();
        } else {
            loginError.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.classList.remove('hidden');
    } finally {
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
}

// Handle logout
async function handleLogout() {
    try {
        await fetch('/api/admin/logout', { method: 'POST' });
        showLogin();
    } catch (error) {
        console.error('Logout error:', error);
        showLogin();
    }
}

// Load projects list
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        projectsList.innerHTML = projects.map(project => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-900">${project.title}</h4>
                    <p class="text-sm text-gray-600">${project.category}</p>
                </div>
                <button 
                    onclick="deleteProject(${project.id})"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                    Delete
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = '<p class="text-gray-600">Error loading projects.</p>';
    }
}

// Load blog posts list
async function loadBlogPosts() {
    try {
        const response = await fetch('/api/blog');
        const posts = await response.json();
        
        blogList.innerHTML = posts.map(post => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-900">${post.title}</h4>
                    <a href="${post.url}" target="_blank" class="text-sm text-blue-600 hover:text-blue-700">
                        ${post.url}
                    </a>
                </div>
                <button 
                    onclick="deleteBlogPost(${post.id})"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                    Delete
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogList.innerHTML = '<p class="text-gray-600">Error loading blog posts.</p>';
    }
}

// Handle add project form submission
async function handleAddProject(event) {
    event.preventDefault();
    
    const formData = new FormData(addProjectForm);
    const projectData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category')
    };
    
    try {
        const response = await fetch('/api/admin/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        });
        
        if (response.ok) {
            addProjectForm.reset();
            loadProjects();
            showNotification('Project added successfully!', 'success');
        } else {
            throw new Error('Failed to add project');
        }
    } catch (error) {
        console.error('Error adding project:', error);
        showNotification('Error adding project. Please try again.', 'error');
    }
}

// Handle add blog post form submission
async function handleAddBlogPost(event) {
    event.preventDefault();
    
    const formData = new FormData(addBlogForm);
    const blogData = {
        title: formData.get('title'),
        url: formData.get('url')
    };
    
    try {
        const response = await fetch('/api/admin/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blogData),
        });
        
        if (response.ok) {
            addBlogForm.reset();
            loadBlogPosts();
            showNotification('Blog post added successfully!', 'success');
        } else {
            throw new Error('Failed to add blog post');
        }
    } catch (error) {
        console.error('Error adding blog post:', error);
        showNotification('Error adding blog post. Please try again.', 'error');
    }
}

// Delete project
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const response = await fetch(`/api/admin/projects/${id}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            loadProjects();
            showNotification('Project deleted successfully!', 'success');
        } else {
            throw new Error('Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showNotification('Error deleting project. Please try again.', 'error');
    }
}

// Delete blog post
async function deleteBlogPost(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
        const response = await fetch(`/api/admin/blog/${id}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            loadBlogPosts();
            showNotification('Blog post deleted successfully!', 'success');
        } else {
            throw new Error('Failed to delete blog post');
        }
    } catch (error) {
        console.error('Error deleting blog post:', error);
        showNotification('Error deleting blog post. Please try again.', 'error');
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
        'bg-red-100 text-red-800 border border-red-200'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();
    
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Add project form submission
    addProjectForm.addEventListener('submit', handleAddProject);
    
    // Add blog post form submission
    addBlogForm.addEventListener('submit', handleAddBlogPost);
});

// Make delete functions globally available
window.deleteProject = deleteProject;
window.deleteBlogPost = deleteBlogPost;
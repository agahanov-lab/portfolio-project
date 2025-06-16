// Projects page specific JavaScript functionality

let currentPage = 1;
let currentCategory = 'All';
let allProjects = [];
const itemsPerPage = 6;

// DOM elements
const projectsGrid = document.getElementById('projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');

// Fetch all projects from the API
async function loadAllProjects() {
    showLoading(true);
    
    try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        allProjects = await response.json();
        filterProjects(currentCategory);
    } catch (error) {
        console.error('Error loading projects:', error);
        showEmptyState(true);
    } finally {
        showLoading(false);
    }
}

// Filter projects by category
function filterProjects(category) {
    currentCategory = category;
    currentPage = 1;
    
    const filteredProjects = category === 'All' 
        ? allProjects 
        : allProjects.filter(project => project.category === category);
    
    displayProjects(filteredProjects);
    updatePagination(filteredProjects.length);
    
    // Update filter button states
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Display projects for current page
function displayProjects(projects) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProjects = projects.slice(startIndex, endIndex);
    
    if (pageProjects.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    projectsGrid.innerHTML = pageProjects.map(createProjectCard).join('');
    
    // Re-observe elements for fade-in animation
    if (window.reobserveElements) {
        setTimeout(window.reobserveElements, 100);
    }
}

// Update pagination controls
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
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
        projectsGrid.classList.add('hidden');
        emptyState.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
        projectsGrid.classList.remove('hidden');
    }
}

// Show/hide empty state
function showEmptyState(show) {
    if (show) {
        emptyState.classList.remove('hidden');
        projectsGrid.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        projectsGrid.classList.remove('hidden');
    }
}

// Create project card HTML (reusing from main.js but with fade-in class)
function createProjectCard(project) {
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow fade-in">
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load projects on page load
    loadAllProjects();
    
    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProjects(category);
        });
    });
    
    // Pagination button handlers
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            const filteredProjects = currentCategory === 'All' 
                ? allProjects 
                : allProjects.filter(project => project.category === currentCategory);
            displayProjects(filteredProjects);
            updatePagination(filteredProjects.length);
            
            // Scroll to top of projects section
            projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const filteredProjects = currentCategory === 'All' 
            ? allProjects 
            : allProjects.filter(project => project.category === currentCategory);
        const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            displayProjects(filteredProjects);
            updatePagination(filteredProjects.length);
            
            // Scroll to top of projects section
            projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
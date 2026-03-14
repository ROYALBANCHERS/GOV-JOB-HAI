// ===== Main Application =====
document.addEventListener('DOMContentLoaded', function() {

    // ===== Mobile Navigation Toggle =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // ===== Filter Toggle =====
    const filterToggle = document.getElementById('filterToggle');
    const filterSection = document.getElementById('filterSection');

    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            filterSection.classList.toggle('hidden');
        });
    }

    // ===== Load Jobs =====
    async function loadJobs() {
        try {
            const jobs = await api.getJobs();

            // Filter jobs by category
            const resultJobs = jobs.filter(job => job.category === 'result').slice(0, 8);
            const admitCardJobs = jobs.filter(job => job.category === 'admit_card').slice(0, 8);
            const latestJobs = jobs.filter(job => job.category === 'latest_job').slice(0, 8);

            // Render job lists
            renderJobList('resultsList', resultJobs);
            renderJobList('admitCardsList', admitCardJobs);
            renderJobList('latestJobsList', latestJobs);

            // Render marquee
            renderMarquee(jobs.slice(0, 10));

        } catch (error) {
            console.error('Failed to load jobs:', error);
            showErrorMessage('Failed to load jobs. Please make sure the backend server is running.');
        }
    }

    // ===== Render Job List =====
    function renderJobList(containerId, jobs) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (jobs.length === 0) {
            container.innerHTML = '<div class="loading">No updates available</div>';
            return;
        }

        container.innerHTML = jobs.map(job => `
            <div class="job-item ${job.external_link ? 'external-apply' : ''}">
                <a href="job.html?id=${job.id}">
                    <div class="job-title">${escapeHtml(job.title)}</div>
                    <div class="job-meta">
                        ${job.last_date ? `
                            <div class="job-meta-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Last Date: ${formatDate(job.last_date)}
                            </div>
                        ` : ''}
                        ${job.location ? `
                            <div class="job-meta-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                ${escapeHtml(job.location)}
                            </div>
                        ` : ''}
                        ${job.external_link ? `
                            <button class="apply-button" onclick="applyToJob(${job.id}, '${escapeHtml(job.external_link)}', event)">
                                Apply <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </button>
                        ` : `
                            <button class="apply-button">Apply</button>
                        `}
                    </div>
                </a>
            </div>
        `).join('');
    }

    // ===== Render Marquee =====
    function renderMarquee(jobs) {
        const marquee = document.getElementById('marqueeContent');
        if (!marquee) return;

        marquee.innerHTML = jobs.map(job => `
            <a href="job.html?id=${job.id}">• ${escapeHtml(job.title)}</a>
        `).join(' ');
    }

    // ===== Apply to Job =====
    window.applyToJob = async function(jobId, externalLink, event) {
        event.preventDefault();
        event.stopPropagation();

        // If there's an external link, redirect directly
        if (externalLink) {
            window.open(externalLink, '_blank');
            return;
        }

        // Otherwise, try to record the application
        if (auth.isAuthenticated) {
            try {
                const result = await api.applyJob(jobId);
                if (result.external_link) {
                    window.open(result.external_link, '_blank');
                } else {
                    showMessage('Application submitted successfully!');
                }
            } catch (error) {
                showMessage('Failed to submit application: ' + error.message);
            }
        } else {
            // Redirect to login page
            window.location.href = `login.html?redirect=job.html&id=${jobId}`;
        }
    };

    // ===== Search Form Handler =====
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const searchQuery = document.getElementById('searchInput').value;
            const location = document.getElementById('locationFilter').value;
            const qualification = document.getElementById('qualificationFilter').value;
            const jobType = document.getElementById('jobTypeFilter').value;

            // Build query parameters
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (location) params.append('location', location);
            if (qualification) params.append('qualification', qualification);
            if (jobType) params.append('job_type', jobType);

            // Redirect to search results or filter current page
            window.location.href = `search.html?${params.toString()}`;
        });
    }

    // ===== Reset Filters =====
    const resetFilters = document.getElementById('resetFilters');
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            document.getElementById('searchInput').value = '';
            document.getElementById('locationFilter').value = '';
            document.getElementById('qualificationFilter').value = '';
            document.getElementById('jobTypeFilter').value = '';
            loadJobs();
        });
    }

    // ===== Newsletter Form =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            if (input && input.value) {
                showMessage('Thank you for subscribing!');
                input.value = '';
            }
        });
    }

    // ===== Helper Functions =====
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function showMessage(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #004a99;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function showErrorMessage(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 5000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== Initialize =====
    loadJobs();
});

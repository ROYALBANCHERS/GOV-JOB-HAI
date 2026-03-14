// ===== Authentication Manager =====
class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }

    // Initialize authentication state
    async init() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const user = await api.getCurrentUser();
                this.user = user;
                this.isAuthenticated = true;
                this.updateUI();
            } catch (error) {
                // Token is invalid or expired
                this.logout();
            }
        }
        this.updateUI();
    }

    // Login user
    async login(email, password) {
        try {
            const response = await api.login(email, password);
            this.user = response.user;
            this.isAuthenticated = true;
            this.updateUI();
            return { success: true, user: this.user };
        } catch (error) {
            // Check if running on GitHub Pages
            if (window.location.hostname.includes('github.io')) {
                return { success: false, error: 'Login is not available on GitHub Pages. Please run the application locally with the PHP backend server to use full features. You can still browse all jobs without logging in!' };
            }
            return { success: false, error: error.message };
        }
    }

    // Register new user
    async register(name, email, password, confirmPassword) {
        try {
            const response = await api.register(name, email, password, confirmPassword);
            return { success: true, data: response };
        } catch (error) {
            // Check if running on GitHub Pages
            if (window.location.hostname.includes('github.io')) {
                return { success: false, error: 'Registration is not available on GitHub Pages. Please run the application locally with the PHP backend server to use full features. You can still browse all jobs without registering!' };
            }
            return { success: false, error: error.message };
        }
    }

    // Logout user
    async logout() {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.user = null;
            this.isAuthenticated = false;
            this.updateUI();
            // Redirect to home if not already there
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }
    }

    // Update UI based on authentication state
    updateUI() {
        const loginLink = document.getElementById('loginLink');
        const profileLink = document.getElementById('profileLink');
        const adminLink = document.getElementById('adminLink');

        if (this.isAuthenticated && this.user) {
            // User is logged in
            if (loginLink) loginLink.classList.add('hidden');
            if (profileLink) {
                profileLink.classList.remove('hidden');
                profileLink.textContent = this.user.name || 'Profile';
            }
            if (adminLink && this.user.role === 'admin') {
                adminLink.classList.remove('hidden');
            }
        } else {
            // User is not logged in
            if (loginLink) {
                loginLink.classList.remove('hidden');
                loginLink.textContent = 'Login';
            }
            if (profileLink) profileLink.classList.add('hidden');
            if (adminLink) adminLink.classList.add('hidden');
        }
    }

    // Check if user is admin
    isAdmin() {
        return this.isAuthenticated && this.user && this.user.role === 'admin';
    }

    // Require authentication (redirect to login if not authenticated)
    requireAuth() {
        if (!this.isAuthenticated) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Require admin role
    requireAdmin() {
        if (!this.requireAuth()) {
            return false;
        }
        if (!this.isAdmin()) {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
}

// ===== Initialize Auth Manager =====
const auth = new AuthManager();

// ===== Export for use in other files =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = auth;
}

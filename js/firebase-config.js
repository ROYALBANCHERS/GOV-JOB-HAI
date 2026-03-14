/**
 * Firebase Configuration (Free Tier / Spark Plan)
 *
 * This file contains the Firebase configuration for the free Spark plan.
 * To use this, you need to:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Google Analytics for your project
 * 3. Copy your config from Project Settings > General > Your apps
 * 4. Replace the config object below with your actual config
 */

// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase (only if config is properly set up)
let analytics = null;

try {
    // Check if config has been updated from defaults
    if (firebaseConfig.apiKey !== "YOUR_API_KEY" && typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        analytics = firebase.analytics();

        // Log page view
        analytics.logEvent('page_view', {
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title
        });

        console.log('✅ Firebase Analytics initialized successfully');
    } else {
        console.warn('⚠️ Firebase not configured. Please update firebase-config.js with your Firebase project credentials.');
        console.warn('📖 To setup Firebase: https://github.com/ROYALBANCHERS/GOV-JOB-HAI/blob/main/docs/FIREBASE_SETUP.md');
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Track custom events
function trackEvent(eventName, parameters = {}) {
    if (analytics) {
        analytics.logEvent(eventName, parameters);
        console.log(`📊 Event tracked: ${eventName}`, parameters);
    }
}

// Track page views (for SPA navigation)
function trackPageView(pageTitle, pagePath) {
    if (analytics) {
        analytics.logEvent('page_view', {
            page_title: pageTitle,
            page_path: pagePath,
            page_location: window.location.href
        });
        console.log(`📊 Page view tracked: ${pageTitle}`);
    }
}

// Track job clicks
function trackJobClick(jobId, jobTitle, category) {
    if (analytics) {
        analytics.logEvent('select_content', {
            content_type: 'job',
            item_id: jobId.toString(),
            items: [{
                item_id: jobId.toString(),
                item_name: jobTitle,
                item_category: category,
                content_type: 'job'
            }]
        });
        console.log(`📊 Job click tracked: ${jobTitle}`);
    }
}

// Track search queries
function trackSearch(searchTerm) {
    if (analytics) {
        analytics.logEvent('search', {
            search_term: searchTerm
        });
        console.log(`📊 Search tracked: ${searchTerm}`);
    }
}

// Track job applications
function trackJobApplication(jobId, jobTitle) {
    if (analytics) {
        analytics.logEvent('generate_lead', {
            item_id: jobId.toString(),
            item_name: jobTitle
        });
        console.log(`📊 Job application tracked: ${jobTitle}`);
    }
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.trackEvent = trackEvent;
    window.trackPageView = trackPageView;
    window.trackJobClick = trackJobClick;
    window.trackSearch = trackSearch;
    window.trackJobApplication = trackJobApplication;
}

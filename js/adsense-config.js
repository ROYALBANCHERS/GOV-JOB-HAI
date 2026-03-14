/**
 * Google AdSense Configuration
 *
 * This file handles Google AdSense integration for the website.
 * AdSense is free to use and you earn money when users click on ads.
 *
 * SETUP INSTRUCTIONS:
 * 1. Sign up for Google AdSense: https://www.google.com/adsense/
 * 2. Add your website and get approval
 * 3. Get your AdSense code (ca-pub-XXXXXXXXXXXXXXXX)
 * 4. Replace AD_CLIENT below with your ca-pub ID
 * 5. Create ad units in AdSense dashboard and copy the data-ad-slot IDs
 */

// Your AdSense Client ID (Replace with your actual ca-pub-XXXXXXXXXXXXXXXX)
const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';

// Ad slot configurations (Replace with your actual ad slot IDs from AdSense)
const AD_SLOTS = {
    header: 'XXXXXXXXXX',      // Leaderboard (728x90) - Header
    sidebar: 'XXXXXXXXXX',     // Rectangle (300x250) - Sidebar
    content: 'XXXXXXXXXX',     // Article ad - In-content
    footer: 'XXXXXXXXXX',      // Leaderboard (728x90) - Footer
    job_detail: 'XXXXXXXXXX',  // Rectangle (300x250) - Job detail page
    responsive: 'XXXXXXXXXX'   // Responsive ad - Auto size
};

// Check if AdSense is configured
const isAdSenseConfigured = AD_CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX';

// Initialize AdSense
function initAdSense() {
    if (!isAdSenseConfigured) {
        console.warn('⚠️ Google AdSense not configured. Please update adsense-config.js with your AdSense Client ID.');
        console.warn('📖 To setup AdSense: https://github.com/ROYALBANCHERS/GOV-JOB-HAI/blob/main/docs/ADSENSE_SETUP.md');
        return;
    }

    // AdSense script is loaded via script tag in HTML
    // (adsbygoogle = window.adsbygoogle || []).push({});

    console.log('✅ Google AdSense initialized');
}

// Create an ad element
function createAd(containerId, slotName, format = 'auto') {
    if (!isAdSenseConfigured) {
        // Show placeholder if not configured
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="background: #f3f4f6; border: 2px dashed #d1d5db; padding: 2rem; text-align: center; border-radius: 8px; min-height: ${format === 'auto' ? '100px' : format === 'rectangle' ? '250px' : '90px'};">
                    <p style="color: #6b7280; font-size: 0.875rem; margin: 0;">
                        📢 Ad Space<br>
                        <small>Configure AdSense in adsense-config.js</small>
                    </p>
                </div>
            `;
        }
        return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    const adSlot = AD_SLOTS[slotName];
    if (!adSlot) {
        console.warn(`Ad slot "${slotName}" not configured`);
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Create ad ins element
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = AD_CLIENT;
    ad.dataset.adSlot = adSlot;

    // Set ad format
    if (format === 'auto') {
        ad.dataset.adFormat = 'auto';
        ad.dataset.fullWidthResponsive = 'true';
    } else if (format === 'rectangle') {
        ad.style.width = '300px';
        ad.style.height = '250px';
    } else if (format === 'leaderboard') {
        ad.style.width = '728px';
        ad.style.height = '90px';
    }

    container.appendChild(ad);

    // Push ad
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
        console.log(`✅ Ad loaded: ${slotName}`);
    } catch (error) {
        console.error(`❌ Ad loading error (${slotName}):`, error);
    }
}

// Load all ads on the page
function loadAds() {
    if (isAdSenseConfigured) {
        // Auto ads are handled by AdSense script
        return;
    }

    // Load placeholder ads for unconfigured state
    const adSlots = ['header', 'sidebar', 'content', 'footer', 'job-detail', 'responsive'];
    adSlots.forEach(slot => {
        const containerId = `ad-${slot}`;
        if (document.getElementById(containerId)) {
            createAd(containerId, slot, slot === 'sidebar' || slot === 'job-detail' ? 'rectangle' : 'auto');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAdSense();
        loadAds();
    });
} else {
    initAdSense();
    loadAds();
}

// Export functions
if (typeof window !== 'undefined') {
    window.createAd = createAd;
    window.loadAds = loadAds;
}

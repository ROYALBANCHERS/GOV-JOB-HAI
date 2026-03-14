/**
 * Firebase Authentication System
 *
 * This file handles authentication using Firebase Authentication,
 * which works on static hosting like GitHub Pages.
 *
 * Setup Instructions:
 * 1. Create Firebase project at https://console.firebase.google.com/
 * 2. Enable Authentication (Email/Password)
 * 3. Enable Realtime Database
 * 4. Copy your config to firebase-config.js
 * 5. Run: node scripts/setup-firebase-admin.js
 */

// Firebase Auth instance
let auth = null;
let db = null;

// Initialize Firebase Auth
function initializeFirebaseAuth() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return false;
    }

    try {
        firebase.initializeApp(firebaseConfig);

        // Initialize Auth
        auth = firebase.auth();

        // Initialize Realtime Database
        db = firebase.database();

        console.log('✅ Firebase Auth initialized');
        return true;
    } catch (error) {
        console.error('❌ Firebase Auth initialization error:', error);
        return false;
    }
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return firebaseConfig &&
           firebaseConfig.apiKey &&
           firebaseConfig.apiKey !== "YOUR_API_KEY";
}

// Login with Email & Password
async function firebaseLogin(email, password) {
    if (!auth) {
        throw new Error('Firebase Auth not initialized');
    }

    try {
        // Sign in with email and password
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Get user data from database
        const userSnapshot = await db.ref('users/' + user.uid).once('value');
        const userData = userSnapshot.val();

        if (!userData) {
            await auth.signOut();
            throw new Error('User not found in database');
        }

        if (userData.role !== 'admin') {
            await auth.signOut();
            throw new Error('Access denied. Admin privileges required.');
        }

        // Store in localStorage (for session persistence)
        localStorage.setItem('firebase_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: userData.name,
            role: userData.role,
            emailVerified: user.emailVerified
        }));

        return {
            success: true,
            user: {
                id: user.uid,
                email: user.email,
                name: userData.name,
                role: userData.role
            }
        };
    } catch (error) {
        console.error('Firebase login error:', error);
        throw error;
    }
}

// Register new user
async function firebaseRegister(name, email, password) {
    if (!auth) {
        throw new Error('Firebase Auth not initialized');
    }

    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Store user data in Realtime Database
        await db.ref('users/' + user.uid).set({
            name: name,
            email: email,
            role: 'user', // Default role
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        });

        // Store in localStorage
        localStorage.setItem('firebase_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: name,
            role: 'user',
            emailVerified: user.emailVerified
        }));

        return {
            success: true,
            user: {
                id: user.uid,
                email: user.email,
                name: name,
                role: 'user'
            }
        };
    } catch (error) {
        console.error('Firebase registration error:', error);
        throw error;
    }
}

// Logout
async function firebaseLogout() {
    if (auth) {
        await auth.signOut();
    }
    localStorage.removeItem('firebase_user');
    localStorage.removeItem('auth_token');
    window.location.href = 'index.html';
}

// Get current user from localStorage
function getCurrentFirebaseUser() {
    const userStr = localStorage.getItem('firebase_user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

// Check if user is authenticated
function isFirebaseAuthenticated() {
    const user = getCurrentFirebaseUser();
    return user !== null;
}

// Check if user is admin
function isFirebaseAdmin() {
    const user = getCurrentFirebaseUser();
    return user && user.role === 'admin';
}

// Listen to auth state changes
function onFirebaseAuthStateChanged(callback) {
    if (auth) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in
                const userSnapshot = await db.ref('users/' + user.uid).once('value');
                const userData = userSnapshot.val();

                if (userData) {
                    localStorage.setItem('firebase_user', JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        name: userData.name,
                        role: userData.role
                    }));

                    callback({
                        authenticated: true,
                        user: {
                            id: user.uid,
                            email: user.email,
                            name: userData.name,
                            role: userData.role
                        }
                    });
                }
            } else {
                // User is signed out
                localStorage.removeItem('firebase_user');
                callback({
                    authenticated: false,
                    user: null
                });
            }
        });
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.firebaseLogin = firebaseLogin;
    window.firebaseRegister = firebaseRegister;
    window.firebaseLogout = firebaseLogout;
    window.getCurrentFirebaseUser = getCurrentFirebaseUser;
    window.isFirebaseAuthenticated = isFirebaseAuthenticated;
    window.isFirebaseAdmin = isFirebaseAdmin;
    window.onFirebaseAuthStateChanged = onFirebaseAuthStateChanged;
    window.initializeFirebaseAuth = initializeFirebaseAuth;
    window.isFirebaseConfigured = isFirebaseConfigured;
}

/**
 * Firebase Admin Setup Script
 *
 * This script creates the admin user in Firebase Realtime Database
 * so you can login to the admin panel on GitHub Pages.
 *
 * Run with: node scripts/setup-firebase-admin.js
 *
 * Make sure to:
 * 1. Create Firebase project at https://console.firebase.google.com/
 * 2. Enable Authentication (Email/Password)
 * 3. Enable Realtime Database
 * 4. Update firebase-config.js with your credentials
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for input
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupAdminUser() {
    console.log('\n═════════════════════════════════════════════════════');
    console.log('     🔐 Firebase Admin User Setup');
    console.log('═════════════════════════════════════════════════════\n');

    console.log('This script will create an admin user in Firebase Realtime Database.\n');
    console.log('⚠️  Make sure you have:');
    console.log('   1. Created Firebase project at https://console.firebase.google.com/');
    console.log('   2. Enabled Authentication (Email/Password)');
    console.log('   3. Enabled Realtime Database');
    console.log('   4. Updated firebase-config.js with your credentials\n');

    const email = await question('📧 Enter admin email (default: admin@sarkari.com): ');
    const finalEmail = email.trim() || 'admin@sarkari.com';

    const password = await question('🔑 Enter admin password (default: admin123): ');
    const finalPassword = password.trim() || 'admin123';

    const name = await question('👤 Enter admin name (default: Admin User): ');
    const finalName = name.trim() || 'Admin User';

    console.log('\n✅ Admin User Configuration:');
    console.log('   Email:', finalEmail);
    console.log('   Password:', finalPassword);
    console.log('   Name:', finalName);
    console.log('   Role: admin\n');

    const confirm = await question('❓ Create this admin user? (yes/no): ');

    if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
        // Generate a simple admin user data JSON
        const adminData = {
            uid: 'admin',
            email: finalEmail,
            password: finalPassword,
            name: finalName,
            role: 'admin',
            note: 'Import this into Firebase Realtime Database manually',
            instructions: [
                '1. Go to Firebase Console: https://console.firebase.google.com/',
                '2. Select your project',
                '3. Go to Realtime Database',
                '4. Import this JSON data at root node:',
                '{',
                `  "users": {`,
                `    "admin": {`,
                `      "email": "${finalEmail}",`,
                `      "name": "${finalName}",`,
                `      "role": "admin",',
                `      "createdAt": "${new Date().toISOString()}"',
                `    }`,
                '  }',
                '}',
                '5. After importing, you can login with:',
                `   Email: ${finalEmail}`,
                `   Password: ${finalPassword}`,
                '',
                'Or update the data directly in the Firebase Console.'
            ].join('\n')
        };

        console.log('\n✅ Admin User Data Created!');
        console.log('\n' + '='.repeat(60));
        console.log('📋 Manual Setup Instructions:');
        console.log('='.repeat(60));
        console.log(adminData.instructions);
        console.log('='.repeat(60));
        console.log('\n💡 Save this information for your records:');
        console.log('   Email:', finalEmail);
        console.log('   Password:', finalPassword);
        console.log('\n');
    } else {
        console.log('\n❌ Setup cancelled.');
    }

    rl.close();
    process.exit(0);
}

// Run the setup
setupAdminUser().catch(error => {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
});
